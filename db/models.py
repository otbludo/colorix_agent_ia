from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import ARRAY
from db.database import Base



class Admin(Base):
    __tablename__ = "admin"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), index=True)
    first_name = Column(String(50), index=True)
    number = Column(String(15), unique=True, index=True)
    email = Column(String(255), unique=True, index=True)
    post = Column(String(20), index=True)
    role = Column(String(20), index=True)
    password = Column(String(255), nullable=False)
    status = Column(String(15), index=True)
    devis = relationship("Devis", back_populates="admin")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    

class Customer(Base):
    __tablename__ = "customers"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), index=True)
    first_name = Column(String(50), index=True)
    number = Column(String(15), unique=True, index=True)
    email = Column(String(255), unique=True, index=True)
    company = Column(String(50), index=True)  
    city = Column(String(50), index=True)      
    country = Column(String(50), index=True)
    # category = Column(String(15), index=True)
    status = Column(String(15), index=True)
    devis = relationship("Devis", back_populates="customer")
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Devis(Base):
    __tablename__ = "devis"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), index=True)
    description = Column(String(255), index=True)
    format = Column(String(50), index=True)
    quantity = Column(Integer, index=True)
    impression = Column(String(50), index=True)
    printing_time = Column(String(50), index=True)
    tva = Column(Float, index=True) 
    price = Column(Float, index=True)
    montant_tva = Column(Float, index=True)
    montant_ttc = Column(Float, index=True)
    taux_reduction = Column(Float, index=True)
    id_customer = Column(Integer, ForeignKey("customers.id"))
    id_admin = Column(Integer, ForeignKey("admin.id"))
    # Relations (optionnel mais recommandé)
    customer = relationship("Customer", back_populates="devis")
    admin = relationship("Admin", back_populates="devis")
    created_at = Column(DateTime(timezone=True), server_default=func.now())