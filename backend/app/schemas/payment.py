from pydantic import BaseModel
from typing import Optional


class Payment(BaseModel):
    id: int


class PaymentRequest(BaseModel):
    amount: float
    subtotal: float
    shipping_cost: float
    tax: float
    payment_method: str
    card_number: Optional[str] = None
    expiry: Optional[str] = None
    cvv: Optional[str] = None
    address: str
    city: str
    postal_code: str
    country: str
    product_id: Optional[str] = None
    cart_id: Optional[str] = None
    quantity: Optional[int] = None
