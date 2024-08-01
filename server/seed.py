from app import app, db
from app import ComicBook, Genre, ComicBookGenre, Publisher

def seed_data():
    with app.app_context():
        # Drop all tables
        print("Dropping all tables...")
        db.drop_all()
        # Create all tables
        print("Creating all tables...")
        db.create_all()

        # Genre data
        genres = [
            {"name": "Action"},
            {"name": "Adventure"},
            {"name": "Fantasy"},
            {"name": "Science Fiction"},
            {"name": "Horror"}
        ]

        # Seed the genres
        print("Seeding genres...")
        genre_ids = {}
        for genre in genres:
            new_genre = Genre(name=genre["name"])
            db.session.add(new_genre)
            db.session.commit()
            genre_ids[genre["name"]] = new_genre.id

        print("Genres seeded:", genre_ids)

        # Publisher data
        publishers = [
            {"name": "Boom! Studios"},
            {"name": "DC Comics"},
            {"name": "Image Comics"},
            {"name": "Dynamite Entertainment"},
            {"name": "Marvel Comics"}
        ]

        # Seed the publishers
        print("Seeding publishers...")
        publisher_ids = {}
        for publisher in publishers:
            new_publisher = Publisher(name=publisher["name"])
            db.session.add(new_publisher)
            db.session.commit()
            publisher_ids[publisher["name"]] = new_publisher.id

        print("Publishers seeded:", publisher_ids)

        # Comic book data
        comic_books = [
            {"title": "Something is Killing the Children", "publisher": "Boom! Studios", "rating": 9.2, "reviews": 17, "image_url": "num1.webp"},
            {"title": "Blue Beetle (2023)", "publisher": "DC Comics", "rating": 9.2, "reviews": 10, "image_url": "num2.webp"},
            {"title": "Zatanna: Bring Down The House (2024)", "publisher": "DC Comics", "rating": 9.1, "reviews": 14, "image_url": "num3.webp"},
            {"title": "The Boy Wonder (2024)", "publisher": "DC Comics", "rating": 9.0, "reviews": 37, "image_url": "num4.webp"},
            {"title": "Redcoat (2024)", "publisher": "Image Comics", "rating": 9.0, "reviews": 11, "image_url": "num5.webp"},
            {"title": "Transformers (2023)", "publisher": "Image Comics", "rating": 8.9, "reviews": 34, "image_url": "num6.webp"},
            {"title": "Batman / Superman: World's Finest (2022)", "publisher": "DC Comics", "rating": 8.8, "reviews": 36, "image_url": "num7.webp"},
            {"title": "Local Man (2023)", "publisher": "Image Comics", "rating": 8.8, "reviews": 18, "image_url": "num8.webp"},
            {"title": "Rook Exodus (2024)", "publisher": "Image Comics", "rating": 8.8, "reviews": 16, "image_url": "num9.webp"},
            {"title": "Space Ghost (2024)", "publisher": "Dynamite Entertainment", "rating": 8.7, "reviews": 47, "image_url": "num10.webp"},
            {"title": "Superman (2023)", "publisher": "DC Comics", "rating": 8.7, "reviews": 29, "image_url": "num11.webp"},
            {"title": "Green Lantern (2023)", "publisher": "DC Comics", "rating": 8.7, "reviews": 27, "image_url": "num12.webp"},
            {"title": "Dracula: Blood Hunt (2024)", "publisher": "Marvel Comics", "rating": 8.7, "reviews": 16, "image_url": "num13.webp"},
            {"title": "My Adventures with Superman (2024)", "publisher": "DC Comics", "rating": 8.7, "reviews": 15, "image_url": "num14.webp"},
            {"title": "Deadpool & Wolverine: WWIII (2024)", "publisher": "Marvel Comics", "rating": 8.7, "reviews": 11, "image_url": "num15.webp"},
            {"title": "Aint No Grave (2024)", "publisher": "Image Comics", "rating": 8.6, "reviews": 29, "image_url": "num16.webp"},
            {"title": "Void Rivals (2023)", "publisher": "Image Comics", "rating": 8.6, "reviews": 25, "image_url": "num17.webp"},
            {"title": "Ultimate Spider-Man (2024)", "publisher": "Marvel Comics", "rating": 8.5, "reviews": 33, "image_url": "num18.webp"},
            {"title": "Ultimates (2024)", "publisher": "Marvel Comics", "rating": 8.5, "reviews": 26, "image_url": "num19.webp"},
            {"title": "Batman: Gotham by Gaslight - The Kryptonian Age (2024)", "publisher": "DC Comics", "rating": 8.5, "reviews": 25, "image_url": "num20.webp"}
        ]

        comic_ids = {}
        for comic in comic_books:
            publisher_id = publisher_ids.get(comic["publisher"])
            if not publisher_id:
                print(f"Publisher not found for comic book: {comic['title']}")
                continue
            new_comic = ComicBook(
                title=comic["title"],
                publisher_id=publisher_id,
                rating=comic["rating"],
                reviews=comic["reviews"],
                image_url=comic["image_url"]
            )
            db.session.add(new_comic)
            db.session.commit()
            comic_ids[comic["title"]] = new_comic.id

        print("Comic books seeded:", comic_ids)

        # Comic book genre data
        comic_book_genres = [
            {"comic_book_title": "Something is Killing the Children", "genre_name": "Horror", "user_rating": 9},
            {"comic_book_title": "Blue Beetle (2023)", "genre_name": "Action", "user_rating": 8},
            {"comic_book_title": "Zatanna: Bring Down The House (2024)", "genre_name": "Fantasy", "user_rating": 8},
            {"comic_book_title": "The Boy Wonder (2024)", "genre_name": "Adventure", "user_rating": 7},
            {"comic_book_title": "Redcoat (2024)", "genre_name": "Action", "user_rating": 8},
            {"comic_book_title": "Transformers (2023)", "genre_name": "Science Fiction", "user_rating": 8},
            {"comic_book_title": "Batman / Superman: World's Finest (2022)", "genre_name": "Action", "user_rating": 8},
            {"comic_book_title": "Local Man (2023)", "genre_name": "Adventure", "user_rating": 7},
            {"comic_book_title": "Rook Exodus (2024)", "genre_name": "Fantasy", "user_rating": 8},
            {"comic_book_title": "Space Ghost (2024)", "genre_name": "Science Fiction", "user_rating": 7},
            {"comic_book_title": "Superman (2023)", "genre_name": "Action", "user_rating": 8},
            {"comic_book_title": "Green Lantern (2023)", "genre_name": "Science Fiction", "user_rating": 8},
            {"comic_book_title": "Dracula: Blood Hunt (2024)", "genre_name": "Horror", "user_rating": 7},
            {"comic_book_title": "My Adventures with Superman (2024)", "genre_name": "Adventure", "user_rating": 8},
            {"comic_book_title": "Deadpool & Wolverine: WWIII (2024)", "genre_name": "Action", "user_rating": 8},
            {"comic_book_title": "Aint No Grave (2024)", "genre_name": "Fantasy", "user_rating": 8},
            {"comic_book_title": "Void Rivals (2023)", "genre_name": "Science Fiction", "user_rating": 8},
            {"comic_book_title": "Ultimate Spider-Man (2024)", "genre_name": "Action", "user_rating": 8},
            {"comic_book_title": "Ultimates (2024)", "genre_name": "Science Fiction", "user_rating": 7},
            {"comic_book_title": "Batman: Gotham by Gaslight - The Kryptonian Age (2024)", "genre_name": "Action", "user_rating": 8}
        ]

        print("Seeding comic book genres...")
        for cbg in comic_book_genres:
            comic_book_id = comic_ids.get(cbg["comic_book_title"])
            genre_id = genre_ids.get(cbg["genre_name"])
            if not comic_book_id or not genre_id:
                print(f"Comic book or genre not found for: {cbg['comic_book_title']} - {cbg['genre_name']}")
                continue
            new_comic_book_genre = ComicBookGenre(
                comic_book_id=comic_book_id,
                genre_id=genre_id,
                user_rating=cbg["user_rating"]
            )
            db.session.add(new_comic_book_genre)
            db.session.commit()

        print("Comic book genres seeded.")

if __name__ == "__main__":
    seed_data()
