from typing import Dict, Any, Optional
from fastapi import APIRouter, Depends
from app.dependencies.response_handler import ResponseHandler, get_response_handler
from app.models import Shop as ShopModel


router = APIRouter()


class Shop:
    @staticmethod
    @router.get("/shops", response_model=Dict[str, Any])
    async def index(
        name: Optional[str] = None,
        response_handler: ResponseHandler = Depends(get_response_handler)
    ):
        try:
            filters = {}
            if name:
                filters["name"] = name
            # Get the products from the database
            shops = await ShopModel.get(filters)

            # Returns the data with the response
            return response_handler.send_success_response(data=shops)
        except Exception as e:
            print(e)
            return response_handler.send_error_response(message=str(e), status_code=500)
