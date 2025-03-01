import re

def is_valid_email(email):
    """ Validate email using regex """
    pattern = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
    return re.match(pattern, email) is not None

def is_valid_phone(phone):
    pattern = r'^\+?1?\d{10}$'  # Supports international numbers
    return re.match(pattern, phone) is not None
