from makefast.base_model.mongodb import MongoDBBase


class Favourite(MongoDBBase):
    collection_name = "favourites"
