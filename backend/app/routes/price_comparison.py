from typing import Dict, Any
from fastapi import APIRouter, Depends, Body
from pydantic import BaseModel, Field
from typing import List, Optional
from bson import ObjectId

from app.dependencies.response_handler import ResponseHandler, get_response_handler
from app.models import Product as ProductModel
from app.ai_models import similarity_model

router = APIRouter()


# Product model
class Product(BaseModel):
    _id: str
    title: str
    price: float = 0.0
    original_price: float = 0.0
    images: List[str] = []
    discount: Optional[str] = None
    qty: int = 0
    ratings: float = 0.0
    category: Optional[str] = None
    brand: Optional[str] = None
    description: Optional[str] = None
    shop_name: Optional[str] = None
    similarity_score: Optional[float] = None
    price_difference: Optional[float] = None
    price_difference_percentage: Optional[float] = None


class ProductQuery(BaseModel):
    product_id: str
    max_results: Optional[int] = Field(default=5, description="Maximum number of similar products to return")
    price_threshold: Optional[float] = Field(default=1.0, description="Return products with price <= query_product_price * price_threshold")


class SimilarProduct(BaseModel):
    product: Product
    similarity_score: float
    price_difference: float
    price_difference_percentage: float


class SimilarProductsResponse(BaseModel):
    similar_products: List[SimilarProduct]
    query_product: Product


class PriceComparison:
    @staticmethod
    @router.post("/price-comparison", response_model=Dict[str, Any])
    async def index(
        query: ProductQuery = Body(...),
        response_handler: ResponseHandler = Depends(get_response_handler)
    ):
        """
        Find similar products with lower prices than the provided product
        """
        try:
            # Ensure model is initialized
            if similarity_model.product_vectors is None:
                await PriceComparison._refresh_model()

            product_selected = Product(**await ProductModel.find({"_id": ObjectId(query.product_id)}))

            if not product_selected:
                return response_handler.send_unprocessable_response(message="Product not found")

            # Find similar products
            similar_products = await similarity_model.find_similar_products(
                product_selected,
                max_results=query.max_results,
                price_threshold=query.price_threshold
            )

            # Convert to response model
            response_products = []
            for product in similar_products:
                # Convert MongoDB product to Pydantic model
                product_data = product['product']
                if query.product_id != product_data.get('_id'):
                    product_model = Product(
                        _id=product_data.get('_id'),
                        title=product_data.get('title'),
                        price=product_data.get('price', 0),
                        ratings=product_data.get('ratings', 0),
                        original_price=product_data.get('original_price', 0),
                        category=product_data.get('category'),
                        brand=product_data.get('brand'),
                        images=product_data.get('images'),
                        discount=product_data.get('discount'),
                        description=product_data.get('description'),
                        qty=product_data.get('qty', 0),
                        similarity_score=product['similarity_score'],
                        shop_name=product_data['shop_name'],
                        price_difference=product['price_difference'],
                        price_difference_percentage=product['price_difference_percentage'],
                    ).model_dump()

                    response_products.append(product_model)

            return response_handler.send_success_response(data=response_products)
        except Exception as e:
            print(e)
            return response_handler.send_error_response(message=str(e), status_code=500)

    @classmethod
    async def _refresh_model(cls):
        """Refresh the ML model with the latest product data from MongoDB"""
        products = list(await ProductModel.all())
        for product in products:
            product['_id'] = str(product['_id'])  # Convert ObjectId to string

        similarity_model.fit(products)
        return {"status": "success", "message": f"Model refreshed with {len(products)} products"}
