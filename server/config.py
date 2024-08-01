import os
from sqlalchemy import MetaData

class Config:
    # General
    SECRET_KEY = os.getenv('SECRET_KEY', 'your_default_secret_key')
    
    # Database
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'sqlite:///app.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False  
    
    # Naming convention for database
    SQLALCHEMY_METADATA = MetaData(naming_convention={
        "pk": "pk_%(table_name)s_%(column_0_name)s",
        "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
        "ix": "ix_%(table_name)s_%(column_0_name)s",
        "uq": "uq_%(table_name)s_%(column_0_name)s",
        "ck": "ck_%(table_name)s_%(constraint_name)s"
    })
