from typing import Dict, Any
from bson import ObjectId

from fastapi import APIRouter, Depends
from app.dependencies.response_handler import ResponseHandler, get_response_handler
from app.models import Product as ProductModel

router = APIRouter()


class Product:
    @staticmethod
    @router.get("/product/list", response_model=Dict[str, Any])
    async def index(category: str, response_handler: ResponseHandler = Depends(get_response_handler)):
        """
        Registers a new user in the MongoDB database.

        Args:
           :param category: Product category
           :param response_handler: Return response handler

        Returns:
           Data of objects that contains products data
        """
        try:
            # Get the products from the database
            products = await ProductModel.get({"category": category}, 10)

            # Returns the data with the response
            return response_handler.send_success_response(data=products)
        except Exception as e:
            return response_handler.send_error_response(message=str(e), status_code=500)

    @staticmethod
    @router.get("/product/{product_id}", response_model=Dict[str, Any])
    async def show(product_id: str, response_handler: ResponseHandler = Depends(get_response_handler)):
        """
        Get the specific product

        Args:
           :param product_id: Product id
           :param response_handler: Return response handler

        Returns:
           Data of objects that contains product data
        """
        try:
            # Get the products from the database
            product = await ProductModel.find({"_id": ObjectId(product_id)})

            if product is None:
                return response_handler.send_success_response(message="Product not found", data=[])

            # Returns the data with the response
            return response_handler.send_success_response(data=product)
        except Exception as e:
            return response_handler.send_error_response(message=str(e), status_code=500)
