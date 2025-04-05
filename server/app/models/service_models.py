from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.extensions import db

class Service(db.Model):
    __tablename__ = "services"

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False, unique=True)
    description = Column(String(255), nullable=True)

    staff = relationship("Staff", back_populates="specialization", cascade="all, delete-orphan")
    # Back-reference to ServiceRequest
    service_requests = relationship("ServiceRequest", back_populates="service", cascade="all, delete-orphan")

class ServiceRequest(db.Model):
    __tablename__ = "service_requests"

    id = Column(Integer, primary_key=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False)
    service_id = Column(Integer, ForeignKey("services.id", ondelete="CASCADE"), nullable=False)
    status = Column(String(50), default="Pending")  # Pending, Approved, Completed
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    tenant = relationship("Tenant", back_populates="service_requests")
    service = relationship("Service", back_populates="service_requests")