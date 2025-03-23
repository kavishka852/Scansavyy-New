from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from app.models import Shop


# ML model for product similarity
class ProductSimilarityModel:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(stop_words='english')
        self.product_vectors = None
        self.product_data = None

    def fit(self, products):
        """Train the model on product data"""
        product_texts = [f"{p['title']} {p['description']} {p['category']} {p.get('brand', '')}"
                         for p in products]
        self.product_vectors = self.vectorizer.fit_transform(product_texts)
        self.product_data = products

    async def find_similar_products(self, query_product, max_results=5, price_threshold=1.0):
        """Find similar products with price lower than the query product"""
        # Create query text
        query_text = f"{query_product.title} {query_product.description} {query_product.category} {query_product.brand or ''}"
        query_vector = self.vectorizer.transform([query_text])

        # Calculate similarity scores
        similarity_scores = cosine_similarity(query_vector, self.product_vectors).flatten()

        # Find products with lower prices
        similar_products = []
        for i, score in enumerate(similarity_scores):
            product = self.product_data[i]
            if product['price'] <= query_product.price * price_threshold:
                price_diff = query_product.price - product['price']
                price_diff_percentage = (price_diff / query_product.price) * 100

                shop = await Shop.find({"_id": product['shop_id']})
                product["shop_name"] = shop["name"]

                if query_product.category == product['category'] and query_product.brand == product['brand']:
                    similar_products.append({
                        'product': product,
                        'similarity_score': float(score),
                        'price_difference': float(price_diff),
                        'price_difference_percentage': float(price_diff_percentage)
                    })

        # Sort by similarity score and return top results
        similar_products.sort(key=lambda x: x['similarity_score'], reverse=True)
        return similar_products[:max_results]


# Initialize ML model
similarity_model = ProductSimilarityModel()
