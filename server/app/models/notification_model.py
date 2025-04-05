from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from datetime import datetime
from app.extensions import db

class Notification(db.Model):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("mygate_users.id", ondelete="CASCADE"), nullable=False)
    role = Column(String(20), nullable=False)  # "tenant" or "admin"
    message = Column(String(255), nullable=False)
    is_read = Column(Integer, default=0)  # 0 = Unread, 1 = Read
    created_at = Column(DateTime, default=datetime.utcnow)