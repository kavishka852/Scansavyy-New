from typing import Dict, Any

from bson import ObjectId
from fastapi import APIRouter, Depends
from typing_extensions import Annotated

from app.dependencies.response_handler import ResponseHandler, get_response_handler
from app.models import Notification as NotificationModel
from app.schemas import UserSchema
from app.core.auth import Authenticate

router = APIRouter()


class Notification:
    @staticmethod
    @router.get("/notifications", response_model=Dict[str, Any])
    async def retrieve_notifications(
        current_user: Annotated[UserSchema, Depends(Authenticate.get_current_user)],
        response_handler: ResponseHandler = Depends(get_response_handler)
    ):
        try:
            user_notifications = await NotificationModel.get(
                query={"user_id": ObjectId(current_user.id)}
            )

            formatted_data = [
                {
                    "id": notification["_id"],
                    "content": notification["content"],
                    "type": notification["type"],
                    "read": notification["read"],
                    "created_at": str(notification["created_at"]),
                }
                for notification in user_notifications
            ]

            return response_handler.send_success_response(
                message="Notifications retrieved successfully",
                data=formatted_data
            )
        except Exception as e:
            print(e)
            return response_handler.send_error_response(
                message="Something went wrong while retrieving notifications"
            )

    @staticmethod
    @router.put("/notifications/{notification_id}/read", response_model=Dict[str, Any])
    async def mark_as_read(
        notification_id: str,
        response_handler: ResponseHandler = Depends(get_response_handler)
    ):
        try:
            result = await NotificationModel.update(
                notification_id,
                {"read": True}
            )

            if result == 0:
                return response_handler.send_unprocessable_response(
                    message="Notification not found"
                )

            return response_handler.send_success_response(
                message="Notification marked as read successfully",
                data={
                    "transaction_id": result["transaction_id"],
                }
            )
        except Exception as e:
            print(e)
            return response_handler.send_error_response(
                message="Something went wrong while notification read process."
            )

    @staticmethod
    @router.delete("/notifications/{notification_id}", response_model=Dict[str, Any])
    async def delete_notification(
        notification_id: str,
        response_handler: ResponseHandler = Depends(get_response_handler)
    ):
        try:
            result = await NotificationModel.delete(notification_id)

            if result == 0:
                return response_handler.send_unprocessable_response(
                    message="Notification not found"
                )

            return response_handler.send_success_response(
                message="Notification deleted successfully"
            )
        except Exception as e:
            print(e)
            return response_handler.send_error_response(
                message="Something went wrong while notification deleting."
            )

    @staticmethod
    @router.delete("/notifications", response_model=Dict[str, Any])
    async def delete_all_notifications(
        current_user: Annotated[UserSchema, Depends(Authenticate.get_current_user)],
        response_handler: ResponseHandler = Depends(get_response_handler)
    ):
        try:
            result = await NotificationModel.delete_all({"user_id": ObjectId(current_user.id)})

            if result == 0:
                return response_handler.send_unprocessable_response(
                    message="Notifications not found for delete"
                )

            return response_handler.send_success_response(
                message=f"Notifications successfully deleted"
            )
        except Exception as e:
            print(e)
            return response_handler.send_error_response(
                message="Something went wrong while all notification deleting."
            )

    @staticmethod
    @router.get("/notifications/count", response_model=Dict[str, Any])
    async def notifications_count(
            current_user: Annotated[UserSchema, Depends(Authenticate.get_current_user)],
            response_handler: ResponseHandler = Depends(get_response_handler)
    ):
        try:
            user_notifications = await NotificationModel.get(
                query={"user_id": ObjectId(current_user.id)}
            )

            return response_handler.send_success_response(
                data={
                    "count": len(user_notifications)
                }
            )
        except Exception as e:
            print(e)
            return response_handler.send_error_response(
                message="Something went wrong while counting notifications"
            )
