from app import db
from sqlalchemy.orm import validates

class Publisher(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)

class ComicBook(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    publisher_id = db.Column(db.Integer, db.ForeignKey('publisher.id'), nullable=False)
    publisher = db.relationship('Publisher', backref=db.backref('comic_books', lazy='subquery'))
    rating = db.Column(db.Float, nullable=False)
    reviews = db.Column(db.Integer, nullable=False)
    image_url = db.Column(db.String(255), nullable=True)

class Genre(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)

class ComicBookGenre(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    comic_book_id = db.Column(db.Integer, db.ForeignKey('comic_book.id'), nullable=False)
    genre_id = db.Column(db.Integer, db.ForeignKey('genre.id'), nullable=False)
    user_rating = db.Column(db.Float, nullable=False)
    
    comic_book = db.relationship('ComicBook', backref=db.backref('comic_book_genres', lazy='subquery'))
    genre = db.relationship('Genre', backref=db.backref('comic_book_genres', lazy='subquery'))
