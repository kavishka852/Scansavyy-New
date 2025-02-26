from pydantic import BaseModel
from typing import Optional
from bson import ObjectId


class UserSchema(BaseModel):
    id: Optional[str] = None
    name: str
    email: str
    password: str
    username: Optional[str] = None
    verified: Optional[bool] = None
    status: Optional[int] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None


class UserLoginRequest(BaseModel):
    email: str
    password: str


class ProfileUpdateRequest(BaseModel):
    name: str
    email: str
    password: Optional[str] = None
