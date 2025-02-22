from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def connect():
    try:
        return "Connected to PostgreSQL successfully!", 200
    except Exception as e:
        return f"Connection error: {str(e)}", 500