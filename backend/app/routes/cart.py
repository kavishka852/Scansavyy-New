from typing import Dict, Any
from fastapi import APIRouter, Depends
from typing_extensions import Annotated
from bson import ObjectId

from app.dependencies.response_handler import ResponseHandler, get_response_handler
from app.models import Cart as CartModel, Product as ProductModel
from app.schemas import UserSchema, CartItemUpdateRequest
from app.core.auth import Authenticate

router = APIRouter()


class Cart:
    @staticmethod
    @router.get("/cart", response_model=Dict[str, Any])
    async def get_cart(
        current_user: Annotated[UserSchema, Depends(Authenticate.get_current_user)],
        qty: int | None = None,
        product_id: str | None = None,
        cart_id: str | None = None,
        response_handler: ResponseHandler = Depends(get_response_handler)
    ):
        """Get all items in the user's cart with product details"""
        try:
            # Base match condition
            match_condition = {
                "user_id": ObjectId(current_user.id)
            }

            # Add product_id to match condition if provided
            if cart_id:
                match_condition["_id"] = ObjectId(cart_id)

            if product_id:
                match_condition["product_id"] = ObjectId(product_id)

            pipeline = [
                {
                    "$match": match_condition
                },
                {
                    "$lookup": {
                        "from": "products",
                        "localField": "product_id",
                        "foreignField": "_id",
                        "as": "product"
                    }
                },
                {
                    "$unwind": "$product"
                },
                {
                    "$project": {
                        "_id": {"$toString": "$_id"},
                        "qty": 1,
                        "product_id": {"$toString": "$product_id"},
                        "id": {"$toString": "$product._id"},
                        "name": "$product.title",
                        "color": 1,
                        "price": "$product.price",
                        "image": {"$arrayElemAt": ["$product.images", 0]},
                        "cart_qty": "$qty",
                        "subtotal": {
                            "$multiply": [{"$cond": [
                                # If product_id and qty params exist and match current product
                                {
                                    "$and": [
                                        {"$eq": [{"$toString": "$product._id"}, product_id]},
                                        {"$ne": [qty, None]}
                                    ]
                                },
                                qty,  # Use provided qty
                                "$qty"  # Use existing qty from cart
                            ]}, "$product.price"]
                        }
                    }
                }
            ]

            cart_items = await CartModel.aggregate(pipeline)

            # Calculate total
            total = sum(item["subtotal"] for item in cart_items)

            return response_handler.send_success_response(
                message="Cart items retrieved successfully",
                data={
                    "items": cart_items,
                    "total": total,
                    "item_count": len(cart_items)
                }
            )
        except Exception as e:
            print(e)
            return response_handler.send_error_response(message=str(e), status_code=500)

    @staticmethod
    @router.get("/cart/total", response_model=Dict[str, Any])
    async def get_cart(
        current_user: Annotated[UserSchema, Depends(Authenticate.get_current_user)],
        response_handler: ResponseHandler = Depends(get_response_handler)
    ):
        """Get all items count in the user's cart"""
        try:
            cart_items = await CartModel.get({
                "user_id": ObjectId(current_user.id),
            })

            return response_handler.send_success_response(
                message="Cart items retrieved successfully",
                data={
                    "total": len(cart_items)
                }
            )
        except Exception as e:
            print(e)
            return response_handler.send_error_response(message=str(e), status_code=500)

    @staticmethod
    @router.post("/cart/add", response_model=Dict[str, Any])
    async def add_to_cart(
        data: CartItemUpdateRequest,
        current_user: Annotated[UserSchema, Depends(Authenticate.get_current_user)],
        response_handler: ResponseHandler = Depends(get_response_handler)
    ):
        """Add an item to the cart"""
        try:
            # Check if product already exists in cart
            existing_item = await CartModel.find({
                "user_id": ObjectId(current_user.id),
                "product_id": ObjectId(data.product_id),
                "color": data.color,
            })

            product = await ProductModel.find({"_id": ObjectId(data.product_id)})

            if existing_item:
                # Check the quantity is existing or not
                quantity = int(existing_item["qty"]) + 1
                if data.quantity:
                    quantity = int(existing_item["qty"]) + data.quantity

                if quantity > int(product["qty"]):
                    quantity = int(product["qty"])

                # Update quantity if product exists
                update_cart = await CartModel.update(
                    str(existing_item["_id"]),
                    {"qty": quantity}
                )

                # Send the success response
                return response_handler.send_success_response(
                    message="Cart item quantity updated",
                    data={
                        "quantity": quantity,
                        "update_cart": update_cart["_id"],
                    }
                )

            # Add new item to cart
            cart = await CartModel.create(
                user_id=ObjectId(current_user.id),
                product_id=ObjectId(data.product_id),
                qty=data.quantity,
                color=data.color
            )
            return response_handler.send_success_response(
                message="Item added to cart successfully",
                data={
                    "quantity": data.quantity,
                    "cart_id": cart["_id"],
                }
            )
        except Exception as e:
            print(e)
            return response_handler.send_error_response(message=str(e), status_code=500)

    @staticmethod
    @router.delete("/cart/{product_id}/{color}", response_model=Dict[str, Any])
    async def remove_from_cart(
        product_id: str,
        color: str,
        current_user: Annotated[UserSchema, Depends(Authenticate.get_current_user)],
        response_handler: ResponseHandler = Depends(get_response_handler)
    ):
        """Remove an item from the cart"""
        try:
            # Verify item belongs to user
            existing_item = await CartModel.find({
                "product_id": ObjectId(product_id),
                "user_id": ObjectId(current_user.id),
                "color": color,
            })

            if not existing_item:
                return response_handler.send_unprocessable_response(
                    message="Cart item not found.",
                )

            result = await CartModel.delete_all({
                "product_id": ObjectId(product_id),
                "user_id": ObjectId(current_user.id),
                "color": color,
            })
            if result == 0:
                return response_handler.send_unprocessable_response(
                    message="Cart item not found",
                )

            return response_handler.send_success_response(
                message="Item removed from cart successfully"
            )
        except Exception as e:
            print(e)
            return response_handler.send_error_response(message=str(e), status_code=500)
