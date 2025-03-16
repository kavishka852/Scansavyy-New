from typing import Dict, Any
from fastapi import APIRouter, Depends, Body
from bson import ObjectId

from app.dependencies.response_handler import ResponseHandler, get_response_handler
from app.models import Favourite as FavouriteModel
from typing_extensions import Annotated
from app.schemas import UserSchema
from app.core.auth import Authenticate

router = APIRouter()


class Favourite:
    @staticmethod
    @router.get("/favourites", response_model=Dict[str, Any])
    async def index(
        current_user: Annotated[UserSchema, Depends(Authenticate.get_current_user)],
        response_handler: ResponseHandler = Depends(get_response_handler)
    ):
        # Convert user_id to ObjectId for querying MongoDB
        user_id = ObjectId(current_user.id)

        # Create an aggregation pipeline to join favourites with products and shops
        pipeline = [
            {"$match": {"user_id": user_id}},
            {"$lookup": {
                "from": "products",
                "localField": "product_id",
                "foreignField": "_id",
                "as": "product"
            }},
            {"$unwind": "$product"},
            {"$lookup": {
                "from": "shops",
                "localField": "product.shop_id",
                "foreignField": "_id",
                "as": "shop"
            }},
            {"$unwind": "$shop"},
            {"$project": {
                "_id": {"$toString": "$_id"},
                "user_id": {"$toString": "$user_id"},
                "product_id": {"$toString": "$product_id"},
                "name": "$product.title",
                "price": "$product.price",
                "ratings": "$product.ratings",
                "category": "$product.category",
                "qty": "$product.qty",
                "original_price": "$product.original_price",
                "images": "$product.images",
                "shop_name": "$shop.name",
                "shop_id": {"$toString": "$shop._id"},
                "shop_logo": "$shop.logo",
                "shop_rating": "$shop.rating"
            }}
        ]

        # Execute the aggregation pipeline
        favourites = await FavouriteModel.aggregate(pipeline)

        return response_handler.send_success_response(
            message="Favourites with product and shop details retrieved successfully",
            data=favourites
        )

    @staticmethod
    @router.post("/add-to-favourites", response_model=Dict[str, Any])
    async def add_to_favourites(
            current_user: Annotated[UserSchema, Depends(Authenticate.get_current_user)],
            product_id: str = Body(..., embed=True),
            response_handler: ResponseHandler = Depends(get_response_handler)
    ):
        # Convert IDs to ObjectId for MongoDB
        user_id = ObjectId(current_user.id)

        try:
            product_id_obj = ObjectId(product_id)
        except:
            return response_handler.send_error_response(
                message="Invalid product ID format",
                status_code=400
            )

        # Check if this product is already in user's favorites
        existing_favourite = await FavouriteModel.find({
            "user_id": user_id,
            "product_id": product_id_obj
        })

        if existing_favourite:
            return response_handler.send_success_response(
                message="Product is already in favourites",
            )

        # Add the product to favourites
        favourite_data = {
            "user_id": user_id,
            "product_id": product_id_obj
        }

        result = await FavouriteModel.create(**favourite_data)

        return response_handler.send_success_response(
            message="Product added to favourites successfully",
        )

    @staticmethod
    @router.delete("/favourites/{product_id}", response_model=Dict[str, Any])
    async def remove_from_favourites(
        product_id: str,
        current_user: Annotated[UserSchema, Depends(Authenticate.get_current_user)],
        response_handler: ResponseHandler = Depends(get_response_handler)
    ):
        # Convert IDs to ObjectId for MongoDB
        user_id = ObjectId(current_user.id)

        try:
            product_id_obj = ObjectId(product_id)
        except:
            return response_handler.send_error_response(
                message="Invalid product ID format",
                status_code=400
            )

        # Delete the favourite entry matching both user_id and product_id
        result = await FavouriteModel.delete_all({
            "user_id": user_id,
            "product_id": product_id_obj
        })

        if result == 0:
            return response_handler.send_error_response(
                message="Favourite item not found",
                status_code=422
            )

        return response_handler.send_success_response(
            message="Product removed from favourites successfully",
        )
