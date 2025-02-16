# from pymongo import MongoClient
# from dotenv import load_dotenv
# from flask import jsonify
# import os
# load_dotenv()
# client=MongoClient(os.getenv("MONGODB_URI"))
# db=client[os.getenv("DB_NAME")]
# collection=db[os.getenv("COLLECTION_NAME")]
# def connect():
#     data = list(collection.find())
#     return jsonify(data)


from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def connect():
    try:
        return "Connected to PostgreSQL successfully!", 200
    except Exception as e:
        return f"Connection error: {str(e)}", 500