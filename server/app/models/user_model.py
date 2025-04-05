import enum
from sqlalchemy import Column, Enum, Integer, String, DateTime
from flask_jwt_extended import create_access_token
from sqlalchemy.orm import relationship
from datetime import datetime
from app.extensions import db, bcrypt

class User(db.Model):
    __tablename__ = "mygate_users"

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    phone = Column(String(15), unique=True, nullable=False)
    role = Column(Enum("admin", "tenant", name="userrole"), nullable=False)  # Inline ENUM definition
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationship to Tenant
    tenant_details = relationship(
        "Tenant",
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan"
    )

    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode("utf-8")

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)

    def generate_token(self):
        return create_access_token(identity={"id": self.id, "role": self.role})
