import os
import json
from flask import Flask, jsonify, request  # Ensure jsonify and request are imported
from geopy.geocoders import Nominatim

app = Flask(__name__)

# Set a unique user agent per Nominatim policy.
geolocator = Nominatim(user_agent="your_app_name_here")

def get_location(latitude, longitude):
    # Validate input
    if latitude is None or longitude is None:
        return jsonify({"error": "Latitude and longitude are required"}), 400
    
    try:
        # Reverse geocoding
        location = geolocator.reverse(f"{latitude}, {longitude}")
        if location:
            address = location.address
        else:
            return jsonify({"error": "Address not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    try:
        # Store the address in a text file (using UTF-8 encoding)
        with open("stored_addresses.txt", "a", encoding="utf-8") as f:
            f.write(address + "\n")
    except Exception as e:
        return jsonify({"error": f"Could not store address: {str(e)}"}), 500
    
    return jsonify({"address": address}), 200

# Example route to use the function
@app.route("/get_location", methods=["POST"])
def get_location_route():
    data = request.get_json()
    latitude = data.get("latitude")
    longitude = data.get("longitude")
    return get_location(latitude, longitude)

if __name__ == "__main__":
    app.run(debug=True)
