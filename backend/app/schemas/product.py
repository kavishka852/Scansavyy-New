from pydantic import BaseModel
from typing import List


class Product(BaseModel):
    id: int


class ProductListSchema(BaseModel):
    _id: str
    title: str
    price: str
    original_price: str
    ratings: str
    discount: str
    category: str
    images: List[str]
    qty: int
