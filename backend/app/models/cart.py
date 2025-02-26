from makefast.base_model.mongodb import MongoDBBase


class Cart(MongoDBBase):
    collection_name = "carts"
