from sqlalchemy import Column, ForeignKey, Integer, String, Date
from sqlalchemy.orm import relationship
from app.extensions import db

class Tenant(db.Model):
    __tablename__ = "tenants"
    
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("mygate_users.id", ondelete="CASCADE"), nullable=False, unique=True)
    apartment_id = Column(Integer, ForeignKey("apartments.id", ondelete="CASCADE"), nullable=False)
    address = Column(String(200))
    city = Column(String(100))
    state = Column(String(100))
    zip_code = Column(String(20))
    country = Column(String(50))
    tenant_type = Column(String(50))
    tenant_status = Column(String(50))
    tenant_start_date = Column(Date)
    tenant_end_date = Column(Date)
    family_members = Column(String(200))
    number_of_members = Column(Integer)

    user = relationship("User", back_populates="tenant_details")
    apartment = relationship("Apartment", back_populates="tenants")
    service_requests = relationship("ServiceRequest", back_populates="tenant", cascade="all, delete-orphan")

    def __repr__(self):
        return f'<Tenant {self.name}>'