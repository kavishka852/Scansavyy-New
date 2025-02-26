from makefast.base_model.mongodb import MongoDBBase


class News(MongoDBBase):
    collection_name = "news"
