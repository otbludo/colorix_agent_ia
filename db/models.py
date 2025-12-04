from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import ARRAY, JSON
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
    

class AdminDeleted(Base):
    __tablename__ = "admin_deleted"
    id = Column(Integer, primary_key=True)
    original_id = Column(Integer, unique=True, index=True)  
    name = Column(String(50))
    first_name = Column(String(50))
    number = Column(String(15))
    email = Column(String(255))
    post = Column(String(20))
    role = Column(String(20))
    password = Column(String(255))
    deleted_at = Column(DateTime(timezone=True), server_default=func.now())


class CustomerCategory(Base):
    __tablename__ = "customer_category"
    id = Column(Integer, primary_key=True)
    name = Column(String(50), unique=True)  
    rate = Column(Float, default=1.0)   


class CustomerCategoryDeleted(Base):
    __tablename__ = "customer_category_deleted"
    id = Column(Integer, primary_key=True)
    original_id =  Column(Integer, unique=True, index=True) 
    name = Column(String(50))  
    rate = Column(Float, default=1.0)   


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
    category = Column(String(15), index=True)
    status = Column(String(15), index=True)
    devis = relationship("Devis", back_populates="customer")
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class CustomerDeleted(Base):
    __tablename__ = "customers_deleted"
    id = Column(Integer, primary_key=True, index=True)
    original_id = Column(Integer, unique=True, index=True)
    name = Column(String(50))
    first_name = Column(String(50))
    number = Column(String(15))
    email = Column(String(255))
    company = Column(String(50))  
    city = Column(String(50))      
    country = Column(String(50))
    category = Column(String(15))
    status = Column(String(15))
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
    

class ProductPrinting(Base):
    __tablename__ = "product_printing"
    id = Column(Integer, primary_key=True)
    name = Column(String(255), unique=True, index=True)
    description = Column(String(255))
    format = Column(String(255), index=True)
    papier_grammage =  Column(JSON) 
    peliculage =  Column(JSON) 
    finition = Column(String(255))
    color = Column(String(255), index=True)
    quantity = Column(Integer, index=True)
    category = Column(String(50))
    front_price = Column(Float)
    back_price = Column(Float)


class ProductPrintingDeleted(Base):
    __tablename__ = "product_printing_deleted" 
    id = Column(Integer, primary_key=True)
    original_id = Column(Integer, index=True) 
    name = Column(String(255))
    description = Column(String(255))
    format = Column(String(255))
    papier_grammage =  Column(JSON) 
    peliculage =  Column(JSON) 
    finition = Column(String(255))
    color = Column(String(255))
    quantity = Column(Integer)
    category = Column(String(50))
    front_price = Column(Float)
    back_price = Column(Float)
    deleted_at = Column(DateTime(timezone=True), server_default=func.now())


class AuditLog(Base):
    __tablename__ = "audit_log"
    id = Column(Integer, primary_key=True)
    object_id = Column(Integer)
    action = Column(String)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    performed_by = Column(Integer)  # id du superadmin
    performed_by_email = Column(String)
