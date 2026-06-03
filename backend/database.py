from sqlalchemy import create_engine, Column, Integer, String, Float, Boolean, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime

DATABASE_URL = "sqlite:///./food_bot.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    telegram_id = Column(Integer, unique=True, index=True)
    name = Column(String)
    phone = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class MenuItem(Base):
    __tablename__ = "menu_items"
    id = Column(Integer, primary_key=True)
    name = Column(String)
    description = Column(String, nullable=True)
    price = Column(Float)
    category = Column(String)
    is_available = Column(Boolean, default=True)
    image_url = Column(String, nullable=True)

class Order(Base):
    __tablename__ = "orders"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer)
    items_json = Column(String)  # JSON string of cart items
    total_amount = Column(Float)
    delivery_fee = Column(Float, default=3.0)
    status = Column(String, default="pending")  # pending, paid, preparing, delivered
    payment_ref = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

Base.metadata.create_all(bind=engine)