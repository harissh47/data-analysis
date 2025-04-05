from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.apartment_model import Apartment
from app.extensions import db

apartment_bp = Blueprint("apartment_bp", __name__)

# List all apartments
@apartment_bp.route("/list", methods=["GET"])
@jwt_required()
def list_apartments():
    apartments = Apartment.query.all()
    return jsonify([
        {"id": apartment.id, "apartment_no": apartment.apartment_no, "flat_no": apartment.flat_no}
        for apartment in apartments
    ]), 200

# Create a new apartment
@apartment_bp.route("/create", methods=["POST"])
@jwt_required()
def create_apartment():
    data = request.json
    apartment_no = data.get("apartment_no")
    flat_no = data.get("flat_no")

    # Check if the apartment already exists
    if Apartment.query.filter_by(apartment_no=apartment_no, flat_no=flat_no).first():
        return jsonify({"error": "Apartment with this number and flat already exists"}), 400

    new_apartment = Apartment(apartment_no=apartment_no, flat_no=flat_no)
    db.session.add(new_apartment)
    db.session.commit()

    return jsonify({"message": "Apartment created successfully"}), 201

# Update an apartment
@apartment_bp.route("/update/<int:apartment_id>", methods=["PUT"])
@jwt_required()
def update_apartment(apartment_id):
    data = request.json
    apartment = Apartment.query.get(apartment_id)
    if not apartment:
        return jsonify({"error": "Apartment not found"}), 404

    apartment.apartment_no = data.get("apartment_no", apartment.apartment_no)
    apartment.flat_no = data.get("flat_no", apartment.flat_no)
    db.session.commit()

    return jsonify({"message": "Apartment updated successfully"}), 200

# Delete an apartment
@apartment_bp.route("/delete/<int:apartment_id>", methods=["DELETE"])
@jwt_required()
def delete_apartment(apartment_id):
    apartment = Apartment.query.get(apartment_id)
    if not apartment:
        return jsonify({"error": "Apartment not found"}), 404

    db.session.delete(apartment)
    db.session.commit()

    return jsonify({"message": "Apartment deleted successfully"}), 200