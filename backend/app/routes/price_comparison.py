from typing import Dict, Any
from fastapi import APIRouter, Depends
from app.dependencies.response_handler import ResponseHandler, get_response_handler


router = APIRouter()


class PriceComparison:
    @staticmethod
    @router.get("/price-comparison", response_model=Dict[str, Any])
    async def index(response_handler: ResponseHandler = Depends(get_response_handler)):
        return response_handler.send_success_response(message="This is the index method of Pricecomparison")
