from pydantic import BaseModel
from typing import Optional
from bson import ObjectId


class UserSchema(BaseModel):
    id: Optional[str] = None
    name: str
    email: str
    password: str
    first_login: Optional[bool] = False
    username: Optional[str] = None
    verified: Optional[bool] = None
    status: Optional[int] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None


class UserLoginRequest(BaseModel):
    email: str
    password: str


class ProfileUpdateRequest(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None
    first_login: Optional[bool] = False
