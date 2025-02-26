from makefast.base_model.mongodb import MongoDBBase


class Payment(MongoDBBase):
    collection_name = "payments"
