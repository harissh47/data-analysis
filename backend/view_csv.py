from flask import jsonify
from db import collection

def view_csv():
    try:
        # Fetch all documents from the collection
        data = list(collection.find({}, {'_id': 0}))  # Exclude MongoDB _id field
        
        if not data:
            return jsonify({'message': 'No data found in collection'}), 404
            
        return jsonify({
            'message': 'Data retrieved successfully',
            'records': len(data),
            'data': data
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400
