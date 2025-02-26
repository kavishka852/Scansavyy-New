from datetime import datetime


def get_date_time():
    """
    Get the date and time

    Returns:
        str: Formatted date and time
    """
    now = datetime.now()
    return now.strftime("%Y-%m-%d %H:%M:%S")