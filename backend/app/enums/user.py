from enum import Enum


class UserEnum(str, Enum):
    ACTIVE: int = 1
    INACTIVE: int = 0
