from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()


class Configs(BaseSettings):
    DB_CONNECTION: str
    DB_DATABASE: str
    DB_USERNAME: str
    DB_PASSWORD: str
    DB_CLUSTER: str
    SECRET_KEY: str
    ALGORITHM: str
    SECRET_KEY_VERIFICATION: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int

    class Config:
        extra = "forbid"
        env_file = ".env"


configs = Configs()
