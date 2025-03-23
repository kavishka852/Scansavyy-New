import jwt
import re
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone
from typing import Union
from typing_extensions import Annotated
from jwt.exceptions import InvalidTokenError

from app.models import User
from app.schemas import UserSchema
from app.core.configs import configs

router = APIRouter()


class Authenticate:
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

    @classmethod
    async def authenticate_user(cls, email: str, password: str):
        """
        Authenticate the user using email

        Args:
            :param email: User's email
            :param password: User's password

        Returns:
            bool | UserBase:
        """
        user = await User.find({"email": email})
        if user is None:
            return False
        if not cls.verify_password(password, user["password"]):
            return False
        return UserSchema(**user)

    @classmethod
    def verify_password(cls, plain_password, hashed_password):
        """
        Verify the password

        Args:
            :param plain_password: User's password
            :param hashed_password: Hashed password of the user

        Returns:
            bool: User password exists or not
        """
        if hashed_password == "":
            return False
        return cls.pwd_context.verify(plain_password, hashed_password)

    @classmethod
    def get_password_hash(cls, password):
        """
        Get the hashed password

        Args:
            :param password: User's password

        Returns:
            str: Hashed password.
        """
        return cls.pwd_context.hash(password)

    @classmethod
    def create_access_token(cls, data: dict, expires_delta: Union[timedelta, None] = None):
        """
        Create an access token

        Args:
            :param data: User data
            :param expires_delta: Date object

        Returns:
            str: Encoded JWT token
        """
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.now(timezone.utc) + expires_delta
        else:
            expire = datetime.now(timezone.utc) + timedelta(minutes=15)
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, configs.SECRET_KEY, algorithm=configs.ALGORITHM)
        return encoded_jwt

    @classmethod
    def generate_access_token(cls, username: str) -> str:
        """
        Check the value exists or not.

        Args:
            username (str): String value

        Returns:
            str: Generated username
        """
        access_token_expires = timedelta(minutes=configs.ACCESS_TOKEN_EXPIRE_MINUTES)
        return cls.create_access_token(
            data={"sub": username}, expires_delta=access_token_expires
        )

    @classmethod
    def get_username_from_email(cls, email):
        """
        This function extracts the username (text before "@") from a Gmail address.

        Args:
           email (str): The email address string.

        Returns:
           The username part of the email address, or None if no "@" symbol is found.
        """
        match = re.search(r"(^[^\@]+)", email)
        if match:
            return match.group(1)
        else:
            return None

    @classmethod
    async def get_current_user(cls, token: Annotated[str, Depends(oauth2_scheme)]):
        """
        Get the authenticated user

        Args:
            :param token:

        Returns:
            HTTPException | Any:
        """
        credentials_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
        try:
            payload = jwt.decode(token, configs.SECRET_KEY, algorithms=[configs.ALGORITHM])
            username: str = payload.get("sub")
            if username is None:
                raise credentials_exception
            user = await User.find({'username': username})
            if user is None:
                raise credentials_exception
            return UserSchema(
                id=str(user['_id']),
                name=user['name'],
                email=user['email'],
                username=user['username'],
                first_login=user['first_login'],
                password=user['password'],
            )
        except InvalidTokenError:
            raise credentials_exception
