from typing import Dict, Any
from fastapi import APIRouter, Depends
from typing_extensions import Annotated
from bson import ObjectId

from app.dependencies.response_handler import ResponseHandler, get_response_handler
from app.schemas import UserSchema
from app.core.auth import Authenticate
from app.models import News as NewsModel

router = APIRouter()


class News:
    @staticmethod
    @router.get("/news/all", response_model=Dict[str, Any])
    async def get_all_news(
        current_user: Annotated[UserSchema, Depends(Authenticate.get_current_user)],
        response_handler: ResponseHandler = Depends(get_response_handler)
    ):
        """
        Get all news items from the database using aggregate with date formatting
        """
        try:
            pipeline = [
                {"$match": {"status": 1}},
                {"$project": {
                    "title": 1,
                    "type": 1,
                    "image": 1,
                    "read_time": 1,
                    "created_at": {
                        "$dateToString": {
                            "format": "%Y-%m-%d %H:%M:%S",
                            "date": "$created_at"
                        }
                    },
                    "_id": {"$toString": "$_id"}
                }}
            ]

            news_items = await NewsModel.aggregate(pipeline)

            return response_handler.send_success_response(
                message="News items retrieved successfully",
                data=news_items
            )
        except Exception as e:
            return response_handler.send_error_response(
                message=f"Failed to retrieve news items: {str(e)}"
            )

    @staticmethod
    @router.get("/news/{news_id}", response_model=Dict[str, Any])
    async def get_news_by_id(
        news_id: str,
        current_user: Annotated[UserSchema, Depends(Authenticate.get_current_user)],
        response_handler: ResponseHandler = Depends(get_response_handler)
    ):
        """
        Get a specific news item by its ID
        """
        try:
            # Use aggregation with conditional handling for created_at
            pipeline = [
                {"$match": {"_id": ObjectId(news_id)}},
                {"$project": {
                    "title": 1,
                    "type": 1,
                    "read_time": 1,
                    "image": 1,
                    "writer": 1,
                    "content": 1,
                    "comments": 1,
                    "created_at": {
                        "$dateToString": {
                            "format": "%Y-%m-%d %H:%M:%S",
                            "date": "$created_at"
                        }
                    },
                    "_id": {"$toString": "$_id"}
                }}
            ]

            result = await NewsModel.aggregate(pipeline)

            print(result)

            if not result or len(result) == 0:
                return response_handler.send_error_response(
                    message=f"News with ID {news_id} not found",
                    status_code=404
                )

            news_item = result[0]

            return response_handler.send_success_response(
                message="News item retrieved successfully",
                data=news_item
            )
        except Exception as e:
            print(e)
            return response_handler.send_error_response(
                message=f"Failed to retrieve news item: {str(e)}"
            )
