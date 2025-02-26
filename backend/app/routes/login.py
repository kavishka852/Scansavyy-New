from typing import Dict, Any
from fastapi import APIRouter, Depends
from datetime import timedelta

from app.dependencies.response_handler import ResponseHandler, get_response_handler
from app.core.configs import configs
from app.core.auth import Authenticate
from app.schemas import UserLoginRequest
from app.enums import UserEnum

router = APIRouter()


class Login:
    @staticmethod
    @router.post("/login", response_model=Dict[str, Any])
    async def index(data: UserLoginRequest, response_handler: ResponseHandler = Depends(get_response_handler)):
        """
        User login function

        Args:
            :param data: The data to include in the response.
            :param response_handler: Return response handler

        Returns:
            JSONResponse: Error response or success response.
        """
        try:
            # Check if the user's email and password are correct
            user = await Authenticate.authenticate_user(data.email, data.password)
            if not user:
                return response_handler.send_unauthenticated_response(message="Email or password incorrect.")

            # Check if the user verified
            if user.verified == UserEnum.INACTIVE:
                return response_handler.send_unauthenticated_response(
                    message="We found that your email address has not been verified. Please verify your email and try again."
                )

            # Generate an access token
            access_token_expires = timedelta(minutes=configs.ACCESS_TOKEN_EXPIRE_MINUTES)
            access_token = Authenticate.create_access_token(
                data={"sub": user.username}, expires_delta=access_token_expires
            )

            # Send the success response
            return response_handler.send_success_response(
                message="Login successful!",
                data={
                    "access_token": access_token,
                    "user_data": {
                        "email": user.email,
                        "username": user.username,
                        "name": user.name
                    }
                }
            )
        except Exception as e:
            print(e)
            # Send the error response
            return response_handler.send_error_response(
                message=str(e),
            )
