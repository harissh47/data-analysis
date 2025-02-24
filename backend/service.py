from flask import Flask, request, jsonify
from db import db
from user_model import HouseCleaningService

app = Flask(__name__)

def cleaning_service():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No input data provided"}), 400

    house_number = data.get("house_number")
    service_time = data.get("service_time")
    service_type = data.get("service_type")

    try:
        new_service = HouseCleaningService(
            house_number=house_number,
            service_time=service_time,
            service_type=service_type
        )
        db.session.add(new_service)
        db.session.commit()
        return jsonify({"message": "Cleaning service request added", "house_number": house_number}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
