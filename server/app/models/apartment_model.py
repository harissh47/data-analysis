from sqlalchemy import Column, Integer, String, UniqueConstraint
from sqlalchemy.orm import relationship
from app.extensions import db

class Apartment(db.Model):
    __tablename__ = "apartments"

    id = Column(Integer, primary_key=True)
    apartment_no = Column(String(100), nullable=False)  # Apartment name
    flat_no = Column(String(100), nullable=False)  # Apartment address
    
    # Ensure apartment_no and flat_no combination is unique
    __table_args__ = (UniqueConstraint('apartment_no', 'flat_no', name='unique_apartment_flat'),)

    # Relationships
    tenants = relationship("Tenant", back_populates="apartment", cascade="all, delete-orphan")
    staff = relationship("Staff", back_populates="apartment", cascade="all, delete-orphan")