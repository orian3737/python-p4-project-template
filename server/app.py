from flask import Flask, request, jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_restful import Api, Resource
from config import Config
from werkzeug.utils import secure_filename
import os

app = Flask(__name__, static_folder='static')
app.config.from_object(Config)

db = SQLAlchemy(app)
migrate = Migrate(app, db)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})
api = Api(app)

# Models
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

# Resources
class ComicBookResource(Resource):
    def get(self, comic_book_id=None):
        try:
            if comic_book_id is None:
                search_query = request.args.get('search', '')
                if search_query:
                    comic_books = ComicBook.query.filter(ComicBook.title.ilike(f'%{search_query}%')).all()
                else:
                    comic_books = ComicBook.query.all()
                
                return [
                    {
                        'id': cb.id,
                        'title': cb.title,
                        'publisher': cb.publisher.name if cb.publisher else 'Unknown Publisher',
                        'rating': cb.rating,
                        'reviews': cb.reviews,
                        'image_url': f'/static/images/{cb.image_url}' if cb.image_url else None,
                        'genres': [cg.genre.name if cg.genre else 'Unknown Genre' for cg in cb.comic_book_genres]
                    } for cb in comic_books
                ], 200
            else:
                comic_book = ComicBook.query.get(comic_book_id)
                if comic_book is None:
                    return {'error': 'Comic book not found'}, 404
                return {
                    'id': comic_book.id,
                    'title': comic_book.title,
                    'publisher': comic_book.publisher.name if comic_book.publisher else 'Unknown Publisher',
                    'rating': comic_book.rating,
                    'reviews': comic_book.reviews,
                    'image_url': f'/static/images/{comic_book.image_url}' if comic_book.image_url else None,
                    'genres': [cg.genre.name if cg.genre else 'Unknown Genre' for cg in comic_book.comic_book_genres]
                }, 200
        except Exception as e:
            app.logger.error(f"Error fetching comic books: {str(e)}")
            return {'error': 'Internal Server Error'}, 500

    def post(self):
        try:
            title = request.form.get('title')
            publisher_id = request.form.get('publisher')
            rating = float(request.form.get('rating', 0.0))
            genres = request.form.getlist('genres[]')
            image = request.files.get('image')

            # Set default image_url if no image is uploaded
            image_url = None

            if image and image.filename:
                filename = secure_filename(image.filename)
                image_url = filename
                image.save(os.path.join('static/images', filename))

            new_comic_book = ComicBook(
                title=title,
                publisher_id=publisher_id,
                rating=rating,
                reviews=0,
                image_url=image_url
            )
            db.session.add(new_comic_book)
            db.session.commit()

            for genre_name in genres:
                genre = Genre.query.filter_by(name=genre_name).first()
                if genre:
                    comic_book_genre = ComicBookGenre(
                        comic_book_id=new_comic_book.id,
                        genre_id=genre.id,
                        user_rating=rating
                    )
                    db.session.add(comic_book_genre)
            db.session.commit()

            return {'message': 'Comic book added successfully!'}, 201
        except Exception as e:
            app.logger.error(f"Error adding comic book: {str(e)}")
            return {'error': 'Internal Server Error'}, 500
        
    def put(self, comic_book_id):
        try:
            data = request.json
            comic_book = ComicBook.query.get(comic_book_id)
            if comic_book is None:
                return {'error': 'Comic book not found'}, 404
            
            comic_book.title = data.get('title', comic_book.title)
            comic_book.publisher_id = data.get('publisher_id', comic_book.publisher_id)
            comic_book.rating = data.get('rating', comic_book.rating)
            comic_book.reviews = data.get('reviews', comic_book.reviews)
            
            image = data.get('image_url')
            if image:
                comic_book.image_url = image

            db.session.commit()

            return {
                'id': comic_book.id,
                'title': comic_book.title,
                'publisher': comic_book.publisher.name if comic_book.publisher else 'Unknown Publisher',
                'rating': comic_book.rating,
                'reviews': comic_book.reviews,
                'image_url': f'/static/images/{comic_book.image_url}' if comic_book.image_url else None
            }, 200
        except Exception as e:
            app.logger.error(f"Error updating comic book: {str(e)}")
            return {'error': 'Internal Server Error'}, 500

    def delete(self, comic_book_id):
        try:
            comic_book = ComicBook.query.get(comic_book_id)
            if not comic_book:
                return {'error': 'Comic book not found'}, 404

            # Delete related ComicBookGenre entries
            ComicBookGenre.query.filter_by(comic_book_id=comic_book_id).delete()

            # Delete the comic book
            db.session.delete(comic_book)
            db.session.commit()

            return {'message': 'Comic book deleted successfully!'}, 200
        except Exception as e:
            app.logger.error(f"Error deleting comic book: {str(e)}")
            return {'error': 'Internal Server Error'}, 500

# Add resource to API
api.add_resource(ComicBookResource, '/api/comicbooks', '/api/comicbooks/<int:comic_book_id>')

@app.route('/api/publishers', methods=['GET'])
def get_publishers():
    try:
        publishers = Publisher.query.all()
        return jsonify([{'id': p.id, 'name': p.name} for p in publishers])
    except Exception as e:
        app.logger.error(f"Error fetching publishers: {str(e)}")
        return {'error': 'Internal Server Error'}, 500

@app.route('/static/<path:filename>')
def serve_static(filename):
    return send_from_directory(app.static_folder, filename)

@app.route('/')
def index():
    return '<h1>Project Server</h1>'

if __name__ == '__main__':
    app.run(port=5555, debug=True)
