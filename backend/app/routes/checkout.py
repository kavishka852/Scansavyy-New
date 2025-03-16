from typing import Dict, Any, List
from fastapi import APIRouter, Depends, HTTPException
from bson import ObjectId
from datetime import datetime
from typing_extensions import Annotated

from app.dependencies.response_handler import ResponseHandler, get_response_handler
from app.models import Payment, Product, Cart, Notification
from app.schemas import UserSchema, PaymentRequest
from app.core.auth import Authenticate

router = APIRouter()


class Checkout:
    @staticmethod
    @router.post("/checkout", response_model=Dict[str, Any])
    async def checkout_process(
            payment_data: PaymentRequest,
            current_user: Annotated[UserSchema, Depends(Authenticate.get_current_user)],
            response_handler: ResponseHandler = Depends(get_response_handler)
    ):
        try:
            # Validate payment data
            await Checkout._validate_payment_data(payment_data)

            # Process payment
            payment_successful = await Checkout._process_payment(payment_data)
            if not payment_successful:
                return response_handler.send_error_response(
                    message="Payment processing failed",
                    status_code=400
                )

            if not payment_data.product_id:
                pipeline = [
                    # Match documents for the current user
                    {
                        "$match": {
                            "user_id": ObjectId(current_user.id)
                        }
                    },
                    # Project only the fields we need and rename them
                    {
                        "$project": {
                            "product_id": "$product_id",
                            "qty": 1
                        }
                    }
                ]

                product_ids_and_qty = await Cart.aggregate(pipeline)
            else:
                product_ids_and_qty = [{
                    "_id": ObjectId(payment_data.cart_id),
                    "product_id": ObjectId(payment_data.product_id),
                    "qty": payment_data.quantity
                }]

            # Create payment record
            payment_record = await Checkout._create_payment_record(
                payment_data,
                current_user.id,
                product_ids_and_qty
            )

            # Update the product quantity
            for product_object in product_ids_and_qty:
                product = await Product.find({
                    "_id": product_object["product_id"]
                })

                if product:
                    product_quantity = int(product["qty"]) - int(product_object["qty"])
                    if product_quantity < 0:
                        product_quantity = 0

                    # Update the product quantity
                    await Product.update(product_object["product_id"], {
                        "qty": product_quantity,
                    })

                    # Add the notification
                    await Notification.create(**{
                        "user_id": ObjectId(current_user.id),
                        "content": "Order has been placed!",
                        "type": "mail",
                        "transaction_id": payment_record["transaction_id"],
                        "read": False,
                        "created_at": datetime.utcnow(),
                    })

                    # Delete the cart item if exists
                    await Cart.delete(product_object["_id"])

            return response_handler.send_success_response(
                message="Payment processed successfully",
                data={
                    "payment_id": payment_record["_id"],
                    "transaction_id": payment_record["transaction_id"],
                    "amount": payment_record["amount"],
                    "status": payment_record["status"]
                }
            )

        except Exception as e:
            print(e)
            return response_handler.send_error_response(
                message="An error occurred while processing payment",
                status_code=500
            )

    @staticmethod
    @router.get("/checkout/history", response_model=Dict[str, Any])
    async def payment_history(
            current_user: Annotated[UserSchema, Depends(Authenticate.get_current_user)],
            response_handler: ResponseHandler = Depends(get_response_handler)
    ):
        try:
            pipeline = [
                # Match documents for the current user
                {
                    "$match": {
                        "user_id": ObjectId(current_user.id)
                    }
                },
                # Project only the fields we need and rename them
                {
                    "$project": {
                        "_id": {"$toString": "$_id"},
                        "user_id": {"$toString": "$user_id"},
                        "amount": 1,
                        "subtotal": 1,
                        "shipping_cost": 1,
                        "tax": 1,
                        "status": 1,
                        "payment_method": 1,
                        "transaction_id": 1,
                        "card_details": {"$ifNull": ["$card_details", None]},
                        "date": {"$dateToString": {"format": "%b %d, %Y", "date": "$created_at"}},
                        "hour": {"$dateToString": {"format": "%H", "date": "$created_at"}},  # 24-hour format
                        "minute": {"$dateToString": {"format": "%M", "date": "$created_at"}}
                    }
                },
                # Convert 24-hour format to 12-hour with AM/PM
                {
                    "$project": {
                        "_id": 1,
                        "user_id": 1,
                        "amount": 1,
                        "subtotal": 1,
                        "shipping_cost": 1,
                        "tax": 1,
                        "status": 1,
                        "payment_method": 1,
                        "transaction_id": 1,
                        "card_details": 1,
                        "date": 1,
                        "time": {
                            "$concat": [
                                {
                                    "$toString": {
                                        "$mod": [{"$toInt": "$hour"}, 12]  # Convert 24-hour to 12-hour
                                    }
                                },
                                ":",
                                "$minute",
                                " ",
                                {
                                    "$cond": {
                                        "if": {"$gte": [{"$toInt": "$hour"}, 12]},
                                        "then": "PM",
                                        "else": "AM"
                                    }
                                }
                            ]
                        }
                    }
                },
                # Group by the date field
                {
                    "$group": {
                        "_id": "$date",  # Group by formatted date
                        "payments": {
                            "$push": {
                                "_id": "$_id",
                                "user_id": "$user_id",
                                "amount": "$amount",
                                "status": "$status",
                                "payment_method": "$payment_method",
                                "transaction_id": "$transaction_id",
                                "card_details": "$card_details",
                                "time": "$time"  # Keep formatted time
                            }
                        }
                    }
                },
                # Sort the results by date (newest first)
                {
                    "$sort": {"_id": -1}
                }
            ]

            payments = await Payment.aggregate(pipeline)

            return response_handler.send_success_response(
                message="Payment history retrieved successfully",
                data=payments
            )

        except Exception as e:
            print(e)
            return response_handler.send_error_response(
                message="Failed to retrieve payment history",
                status_code=500
            )

    @staticmethod
    @router.get("/payment/{payment_id}", response_model=Dict[str, Any])
    async def get_payment_details(
            payment_id: str,
            current_user: Annotated[UserSchema, Depends(Authenticate.get_current_user)],
            response_handler: ResponseHandler = Depends(get_response_handler)
    ):
        try:
            pipeline = [
                # Match documents for the specific payment ID and user
                {
                    "$match": {
                        "transaction_id": payment_id,
                        "user_id": ObjectId(current_user.id)
                    }
                },
                # Unwind the products array to prepare for lookup
                {
                    "$unwind": "$products"
                },
                # Lookup product details from products collection
                {
                    "$lookup": {
                        "from": "products",
                        "localField": "products.product_id",
                        "foreignField": "_id",
                        "as": "product_details"
                    }
                },
                # Unwind the product_details array
                {
                    "$unwind": "$product_details"
                },
                # Combine product information
                {
                    "$group": {
                        "_id": "$_id",
                        "user_id": {"$first": "$user_id"},
                        "amount": {"$first": "$amount"},
                        "subtotal": {"$first": "$subtotal"},
                        "shipping_cost": {"$first": "$shipping_cost"},
                        "tax": {"$first": "$tax"},
                        "status": {"$first": "$status"},
                        "payment_method": {"$first": "$payment_method"},
                        "transaction_id": {"$first": "$transaction_id"},
                        "shipping_address": {"$first": "$shipping_address"},
                        "created_at": {"$first": "$created_at"},
                        "card_details": {"$first": "$card_details"},
                        "products": {
                            "$push": {
                                "_id": "$products._id",
                                "product_id": "$products.product_id",
                                "qty": "$products.qty",
                                "product_details": {
                                    "name": "$product_details.title",
                                    "price": "$product_details.price",
                                    "images": "$product_details.images"
                                }
                            }
                        }
                    }
                },
                # Final projection to format the fields
                {
                    "$project": {
                        "_id": {"$toString": "$_id"},
                        "user_id": {"$toString": "$user_id"},
                        "amount": 1,
                        "subtotal": 1,
                        "shipping_cost": 1,
                        "tax": 1,
                        "status": 1,
                        "payment_method": 1,
                        "transaction_id": 1,
                        "shipping_address": 1,
                        "products": {
                            "$map": {
                                "input": "$products",
                                "as": "product",
                                "in": {
                                    "_id": {"$toString": "$$product._id"},
                                    "product_id": {"$toString": "$$product.product_id"},
                                    "qty": "$$product.qty",
                                    "product_details": "$$product.product_details"
                                }
                            }
                        },
                        "created_at": {
                            "$dateToString": {
                                "format": "%Y-%m-%dT%H:%M:%S.%LZ",
                                "date": "$created_at"
                            }
                        },
                        "card_details": {
                            "$cond": {
                                "if": {"$eq": ["$payment_method", "credit_card"]},
                                "then": {
                                    "card_number": "$card_details.card_number",
                                    "expiry": "$card_details.expiry"
                                },
                                "else": "$$REMOVE"
                            }
                        }
                    }
                }
            ]

            payment = await Payment.aggregate(pipeline)

            print(payment)

            if not payment:
                return response_handler.send_error_response(
                    message="Payment not found",
                    status_code=404
                )

            return response_handler.send_success_response(
                message="Payment details retrieved successfully",
                data=payment[0]  # Return the first (and should be only) result
            )

        except Exception as e:
            print(e)
            return response_handler.send_error_response(
                message="Failed to retrieve payment details",
                status_code=500
            )

    @classmethod
    async def _validate_payment_data(cls, payment_data: PaymentRequest) -> bool:
        """Validate payment data before processing"""
        if payment_data.payment_method == "credit_card":
            if not all([
                payment_data.card_number,
                payment_data.expiry,
                payment_data.cvv
            ]):
                raise HTTPException(
                    status_code=400,
                    detail="Card details are required for credit card payments"
                )

            # Basic card validation
            if not (
                len(payment_data.card_number.replace(" ", "")) == 16 and
                len(payment_data.cvv) == 3 and
                len(payment_data.expiry) == 5
            ):
                raise HTTPException(
                    status_code=400,
                    detail="Invalid card details"
                )

        if not all([
            payment_data.address,
            payment_data.city,
            payment_data.postal_code,
            payment_data.country
        ]):
            raise HTTPException(
                status_code=400,
                detail="Shipping address is required"
            )

        return True

    @classmethod
    async def _process_payment(cls, payment_data: PaymentRequest) -> bool:
        """
        Process payment with payment gateway
        In a real implementation, this would integrate with Stripe/PayPal/etc
        """
        # Simulate payment processing
        return True

    @classmethod
    async def _create_payment_record(
            cls,
            payment_data: PaymentRequest,
            user_id: str,
            product_ids_and_qty: List,
    ) -> Dict[str, Any]:
        try:
            """Create payment record in database"""
            payment_record = {
                "user_id": ObjectId(user_id),
                "amount": payment_data.amount,
                "subtotal": payment_data.subtotal,
                "shipping_cost": payment_data.shipping_cost,
                "tax": payment_data.tax,
                "payment_method": payment_data.payment_method,
                "status": "pending",
                "shipping_address": {
                    "address": payment_data.address,
                    "city": payment_data.city,
                    "postal_code": payment_data.postal_code,
                    "country": payment_data.country
                },
                "products": product_ids_and_qty,
                "created_at": datetime.utcnow(),
                "transaction_id": str(ObjectId())  # Generate unique transaction ID
            }

            if payment_data.payment_method == "credit_card":
                payment_record["card_details"] = {
                    "card_number": payment_data.card_number,
                    "expiry": payment_data.expiry,
                    "cvv": payment_data.cvv,
                }

            return await Payment.create(**payment_record)
        except Exception as e:
            print(e)
            print('Error while creating payment record')
