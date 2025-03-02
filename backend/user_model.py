
from datetime import datetime
from db import db

# User Model
class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(150), nullable=False, unique=True)
    password_hash = db.Column(db.String(500), nullable=False)
    usertype = db.Column(db.String(20), default='user')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationship to notifications
    notifications = db.relationship('Notification', back_populates='user', lazy='dynamic', cascade='all, delete-orphan')
    
    def __repr__(self):
        return f'<User {self.username}>'

# Notification Model
class Notification(db.Model):
    __tablename__ = 'notifications'
    
    id = db.Column(db.Integer, primary_key=True)
    message = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Foreign key to users table
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Relationship back to user
    user = db.relationship('User', back_populates='notifications')
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'message': self.message,
            'timestamp': self.timestamp.strftime('%Y-%m-%d %H:%M:%S')
        }
    
    def __repr__(self):
        return f'<Notification {self.id} for User {self.user_id}>'

class Tenant(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    phone = db.Column(db.String(20))
    address = db.Column(db.String(200))
    city = db.Column(db.String(100))
    state = db.Column(db.String(100))
    zip_code = db.Column(db.String(20))
    country = db.Column(db.String(50))
    tenant_type = db.Column(db.String(50))
    tenant_status = db.Column(db.String(50))
    tenant_start_date = db.Column(db.Date)
    tenant_end_date = db.Column(db.Date)
    family_members = db.Column(db.String(200))
    number_of_members = db.Column(db.Integer)

    def __repr__(self):
        return f'<Tenant {self.name}>'

from db import db

class HouseCleaningService(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    house_number = db.Column(db.String(50), nullable=False)
    service_time = db.Column(db.String(50))  # Optionally, convert to a datetime
    service_type = db.Column(db.String(50))

    def __repr__(self):
        return f'<HouseCleaningService {self.house_number} - {self.service_type}>'
