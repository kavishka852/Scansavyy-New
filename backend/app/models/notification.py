from makefast.base_model.mongodb import MongoDBBase


class Notification(MongoDBBase):
    collection_name = "notifications"
