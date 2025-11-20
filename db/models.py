from sqlalchemy import Column, Integer, String
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
    devis_ids = Column(ARRAY(Integer))

class Clients(Base):
    __tablename__ = "customers"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), index=True)
    first_name = Column(String(50), index=True)
    number = Column(String(15), unique=True, index=True)
    email = Column(String(255), unique=True, index=True)
    company = Column(String(50), unique=True, index=True)
    city = Column(String(50), unique=True, index=True)
    country = Column(String(50), unique=True, index=True)
    status = Column(String(15), index=True)
