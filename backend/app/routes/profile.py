from typing import Dict, Any
from fastapi import APIRouter, Depends
from typing_extensions import Annotated

from app.dependencies.response_handler import ResponseHandler, get_response_handler
from app.models import User
from app.schemas import ProfileUpdateRequest, UserSchema
from app.core.auth import Authenticate


router = APIRouter()


class Profile:
    @staticmethod
    @router.post("/profile/update", response_model=Dict[str, Any])
    async def update(
        data: ProfileUpdateRequest,
        current_user: Annotated[UserSchema, Depends(Authenticate.get_current_user)],
        response_handler: ResponseHandler = Depends(get_response_handler)
    ):
        """
        Update the user data

        Args:
            :param data:
            :param current_user:
            :param response_handler:

        Return:
            JSONResponse: Error response or success response.
        """
        try:
            print(data)
            formatted_data = {
                "name": data.name,
                "email": data.email
            }
            if data.first_login:
                formatted_data = {
                    "first_login": data.first_login,
                }
            # Make the hash password
            if data.password:
                hashed_password = Authenticate.get_password_hash(data.password)
                formatted_data["password"] = hashed_password

            # Update the user data
            update_response = await User.update(current_user.id, formatted_data)

            if update_response:
                return response_handler.send_success_response(
                    message="User profile successfully updated.",
                    data={
                        "email": update_response.get("email"),
                        "username": update_response.get("username"),
                        "name": update_response.get("name")
                    }
                )

            # Return the prompt not found response
            return response_handler.send_unprocessable_response(message="Something went wrong while updating user profile!")
        except Exception as e:
            return response_handler.send_error_response(message=str(e), status_code=500)