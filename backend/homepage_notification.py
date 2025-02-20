from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from flask_cors import CORS  # Add this if you need CORS support
from db import db
app = Flask(__name__)
CORS(app)  # Enable CORS if needed

# PostgreSQL configuration (replace with your credentials)



# Notification Model
class Notification(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(50), nullable=False)
    message = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'message': self.message,
            'timestamp': self.timestamp.strftime('%Y-%m-%d %H:%M:%S')
        }

# Create tables (run this once)
with app.app_context():
    db.create_all()

# Notification Endpoints

def homepage_notification_send(user_id, message):
    try:
        if not user_id or not message:
            return jsonify({'error': 'Missing required fields'}), 400

        new_notification = Notification(
            user_id=user_id,
            message=message
        )

        db.session.add(new_notification)
        db.session.commit()
        return jsonify(new_notification.to_dict()), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


def homepage_notification_get(user_id):
    try:
        if not user_id:
            return jsonify({'error': 'user_id parameter is required'}), 400

        notifications = Notification.query.filter_by(user_id=user_id)\
            .order_by(Notification.timestamp.desc()).all()
            
        return jsonify([n.to_dict() for n in notifications]), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

def homepage_notification_delete(user_id):

    try:
        user_id = request.args.get('user_id')
        notification = Notification.query.filter_by(user_id=user_id).order_by(Notification.timestamp.desc()).all()
        db.session.delete(notification)
        db.session.commit()
        return jsonify({'message': 'Notification deleted successfully'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

