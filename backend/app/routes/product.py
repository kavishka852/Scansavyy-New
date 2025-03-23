from typing import Dict, Any
from bson import ObjectId
from typing import Optional
from fastapi import APIRouter, Depends

from app.dependencies.response_handler import ResponseHandler, get_response_handler
from app.models import Product as ProductModel, Shop

router = APIRouter()


class Product:
    @staticmethod
    @router.get("/product/list", response_model=Dict[str, Any])
    async def index(
        category: Optional[str] = None,
        shop_id: Optional[str] = None,
        min_rating: Optional[int] = None,
        limit: Optional[int] = None,
        response_handler: ResponseHandler = Depends(get_response_handler)
    ):
        """
        Registers a new user in the MongoDB database.

        Args:
           :param category: Product category
           :param shop_id: Shop id
           :param min_rating: Ratings of the product
           :param limit: Product limit
           :param response_handler: Return response handler

        Returns:
           Data of objects that contains products data
        """
        try:
            filters = {}
            if category:
                filters["category"] = category
            if shop_id:
                filters["shop_id"] = ObjectId(shop_id)
            if min_rating:
                filters["ratings"] = {"$gte": min_rating}

            # Get the products from the database
            products = await ProductModel.get(filters, limit)

            # Convert ObjectId to string in the results
            for product in products:
                if "shop_id" in product:
                    shop = await Shop.find({"_id": product['shop_id']})
                    product["shop_id"] = str(product["shop_id"])
                    product["shop_name"] = shop["name"]

            # Returns the data with the response
            return response_handler.send_success_response(data=products)
        except Exception as e:
            print(e)
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

            shop = await Shop.find({"_id": product['shop_id']})
            product['shop_id'] = str(product['shop_id'])
            product["shop_name"] = shop["name"]

            if product is None:
                return response_handler.send_success_response(message="Product not found", data=[])

            # Returns the data with the response
            return response_handler.send_success_response(data=product)
        except Exception as e:
            print(e)
            return response_handler.send_error_response(message=str(e), status_code=500)
