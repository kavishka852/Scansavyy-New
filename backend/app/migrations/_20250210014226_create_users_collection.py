from makefast.migration import Migration


class CreateUsersCollection:
    
    @classmethod
    async def run(cls):
        try:
            await Migration.create("users", {})
        except Exception as e:
            print(e)

