# Comic Zone API

## Description
Comic Zone is a web application designed to manage and display comic book information. It includes features to search, add, update, and delete comic books, as well as manage publishers and genres. The application uses Flask for the backend and React for the frontend, supporting full CRUD operations on comic books with associated genres and publishers.

## Table of Contents
- [Project Overview](#project-overview)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
  - [Comic Books](#comic-books)
  - [Publishers](#publishers)
  - [Genres](#genres)
- [Models](#models)
  - [Publisher](#publisher)
  - [ComicBook](#comicbook)
  - [Genre](#genre)
  - [ComicBookGenre](#comicbookgenre)
- [Configuration](#configuration)
- [Seeding Data](#seeding-data)
- [License](#license)

## Project Overview
The Comic Zone application allows users to manage comic book data, including titles, publishers, ratings, and genres. The backend is developed using Flask with SQLAlchemy for database management, Flask-Migrate for migrations, and Flask-RESTful for API management. The frontend, built with React, features components for comic book forms, lists, and search functionality.

## Installation

1. **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2. **Install dependencies using Pipenv:**
    ```bash
    pipenv install
    ```

3. **Set up environment variables (refer to `config.py` for required variables):**
    ```bash
    export SECRET_KEY='your_secret_key'
    export DATABASE_URL='sqlite:///app.db'
    ```

4. **Initialize the database:**
    ```bash
    pipenv run flask db upgrade
    ```

## Usage

To start the Flask server, run:
```bash
pipenv run flask run

The frontend React application will be available at http://localhost:3000 and the backend API at http://localhost:5555.

API Endpoints
Comic Books
GET /api/comicbooks: Retrieve a list of comic books.
POST /api/comicbooks: Add a new comic book.
GET /api/comicbooks/{id}: Retrieve a specific comic book by ID.
PUT /api/comicbooks/{id}: Update a specific comic book by ID.
DELETE /api/comicbooks/{id}: Delete a specific comic book by ID.
Publishers
GET /api/publishers: Retrieve a list of publishers.
POST /api/publishers: Add a new publisher.
Genres
GET /api/genres: Retrieve a list of genres.
POST /api/genres: Add a new genre.
Models
Publisher
Represents a comic book publisher.

id: Integer, unique identifier.
name: String, name of the publisher.
ComicBook
Represents a comic book.

id: Integer, unique identifier.
title: String, title of the comic book.
publisher_id: Integer, foreign key linking to the Publisher model.
rating: Integer, rating of the comic book (1-5).
reviews: Text, reviews for the comic book.
image_url: String, URL or path of the comic book's image.
Genre
Represents a comic book genre.

id: Integer, unique identifier.
name: String, name of the genre.
ComicBookGenre
Represents the many-to-many relationship between ComicBook and Genre.

id: Integer, unique identifier.
comic_book_id: Integer, foreign key linking to the ComicBook model.
genre_id: Integer, foreign key linking to the Genre model.
user_rating: Integer, user rating for the genre in the context of the comic book.
Configuration
Configuration is managed via environment variables. Ensure the following variables are set:

SECRET_KEY: A secret key for the Flask application.
DATABASE_URL: The URL for the database.
Seeding Data
To seed the database with initial data, use:

bash
Copy code
pipenv run flask seed
License
This project is licensed under the MIT License. See the LICENSE file for details.

vbnet
Copy code


This structure is concise and provides all necessary details while adhering to common README standards. Let me know if you need any further adjustments!
