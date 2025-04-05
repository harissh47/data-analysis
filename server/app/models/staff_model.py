from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.extensions import db

class Staff(db.Model):
    __tablename__ = "staff"

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    phone = Column(String(15), nullable=False, unique=True)
    apartment_id = Column(Integer, ForeignKey("apartments.id", ondelete="CASCADE"), nullable=False)
    specialization_id = Column(Integer, ForeignKey("services.id", ondelete="CASCADE"), nullable=False)  # Foreign key to Service

    # Relationship
    apartment = relationship("Apartment", back_populates="staff")
    specialization = relationship("Service", back_populates="staff")  # Reference to Service model

class StaffAllocation(db.Model):
    __tablename__ = "staff_allocations"

    id = Column(Integer, primary_key=True)
    service_request_id = Column(Integer, ForeignKey("service_requests.id", ondelete="CASCADE"), nullable=False)
    staff_id = Column(Integer, ForeignKey("staff.id", ondelete="CASCADE"), nullable=False)