from makefast.base_model.mongodb import MongoDBBase


class Product(MongoDBBase):
    collection_name = "products"
