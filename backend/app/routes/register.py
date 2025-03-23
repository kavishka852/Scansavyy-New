import random
from typing import Dict, Any
from fastapi import APIRouter, Depends

from app.dependencies.response_handler import ResponseHandler, get_response_handler
from app.core.auth import Authenticate
from app.utils import get_date_time
from app.models import User
from app.schemas import UserSchema
from app.enums import UserEnum


router = APIRouter()


class Register:
    @staticmethod
    @router.post("/register", response_model=Dict[str, Any])
    async def index(data: UserSchema, response_handler: ResponseHandler = Depends(get_response_handler)):
        """
        Registers a new user in the MongoDB database.

        Args:
           :param data: User data to be registered.
           :param response_handler: Return response handler

        Returns:
           bool: True if registration is successful, False otherwise.
        """
        try:
            # Validate the fields
            if data.email == "" or data.password == "" or data.name == "":
                return response_handler.send_unprocessable_response(message="Required fields cannot be empty.")

            # Check if the user already exists or not
            result = await User.find({"email": data.email})
            if result:
                return response_handler.send_unauthenticated_response(
                    message="Email already registered on our system."
                )

            # Hashed the password
            hashed_password = Authenticate.get_password_hash(data.password)
            date_time_now = get_date_time()

            # Generate the username
            username = await Register._rebuild_username(Authenticate.get_username_from_email(data.email))

            # Create a document for the user
            user_data = {
                "username": username,
                "name": data.name,
                "email": data.email,
                "password": hashed_password,
                "status": UserEnum.ACTIVE,
                "verified": True,
                "created_at": date_time_now,
                "updated_at": date_time_now,
                "first_login": False
            }

            # Insert the user data into the collection
            result = await User.create(**user_data)

            if result["_id"]:
                # If user registration success
                return response_handler.send_success_response(
                    message="Registration successful.",
                )

            # Send the error message if user register fails
            return response_handler.send_error_response()
        except Exception as e:
            # Send the error response
            return response_handler.send_error_response(
                message=str(e),
            )

    @classmethod
    async def _rebuild_username(cls, name):
        """
        Generate a unique username based on the given name.

        Args:
            name (str): User's name

        Returns:
            str: A unique username
        """
        base_name = name
        attempt = 0
        max_attempts = 10  # Prevent infinite loop

        while attempt < max_attempts:
            try:
                # Check if the username exists
                user_exists = await User.find({'username': name})
                if not user_exists:
                    return name

                # If user exists, add or modify the random suffix
                random_suffix = random.randint(10, 99)  # Two-digit random number
                name = f"{base_name}.{random_suffix}"
                attempt += 1
            except Exception as e:
                print(f"Error on generateUsername function: {e}")
                return base_name  # Return original name if there's an error

        # If we couldn't generate a unique username after max_attempts
        print(f"Couldn't generate a unique username for {base_name} after {max_attempts} attempts")
        return base_name
