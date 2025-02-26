from pydantic import BaseModel
from typing import Optional


class Cart(BaseModel):
    id: int


class CartItemUpdateRequest(BaseModel):
    product_id: str
    quantity: Optional[int] = None
    color: Optional[str] = None
