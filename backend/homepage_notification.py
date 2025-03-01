from flask import request, jsonify
from user_model import Notification
from db import db

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
        if not user_id:
            return jsonify({'error': 'Missing required user_id'}), 400
        notifications = Notification.query.filter_by(user_id=user_id).order_by(Notification.timestamp.desc()).all()
        if not notifications:
            return jsonify({'message': 'No notifications found'}), 404
        for notification in notifications:
            db.session.delete(notification)  # Delete each notification
        db.session.commit()
        return jsonify({'message': 'Notification deleted successfully'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

