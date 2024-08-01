// src/components/ComicBookList.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/comicBookList.css';

const ComicBookList = () => {
    const [comicBooks, setComicBooks] = useState([]);
    const [selectedComic, setSelectedComic] = useState(null);
    const { searchTerm } = useParams(); 

    useEffect(() => {
        const fetchComics = async () => {
            const searchQuery = searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : '';
            try {
                const response = await fetch(`http://localhost:5555/api/comicbooks${searchQuery}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                if (Array.isArray(data)) {
                    setComicBooks(data);
                } else {
                    console.error('Expected an array of comic books, received:', data);
                }
            } catch (error) {
                console.error('Error fetching comic books:', error);
            }
        };

        fetchComics();
    }, [searchTerm]);

    const handleComicClick = (comic) => {
        setSelectedComic(comic);
    };

    const handleCloseComic = () => {
        setSelectedComic(null);
    };

    const handleDelete = (comicId, event) => {
        event.stopPropagation();
        fetch(`http://localhost:5555/api/comicbooks/${comicId}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (response.ok) {
                    setComicBooks(comicBooks.filter(comic => comic.id !== comicId));
                    if (selectedComic && selectedComic.id === comicId) {
                        handleCloseComic();
                    }
                } else {
                    console.error('Failed to delete comic book');
                }
            })
            .catch(error => console.error('Error deleting comic book:', error));
    };

    return (
        <div className="comic-book-list">
            <h1>{searchTerm ? `Search Results for "${searchTerm}"` : 'Comic Books'}</h1>
            {selectedComic ? (
                <div className="comic-card comic-card-selected" key={selectedComic.id}>
                    <button className="close-button" onClick={handleCloseComic}>X</button>
                    <img
                        src={selectedComic.image_url ? `http://localhost:5555${selectedComic.image_url}` : 'default-image-url'}
                        alt={selectedComic.title}
                    />
                    <h2>{selectedComic.title}</h2>
                    <p>Publisher: {selectedComic.publisher}</p>
                    <p>Rating: {selectedComic.rating}</p>
                    <p>Reviews: {selectedComic.reviews}</p>
                    <p>Genres: {selectedComic.genres.join(', ')}</p>
                    <button className="delete-button" onClick={(e) => handleDelete(selectedComic.id, e)}>Delete</button>
                </div>
            ) : (
                <div className="comic-books-container">
                    {comicBooks.length > 0 ? (
                        comicBooks.map(comic => (
                            <div className="comic-card" key={comic.id} onClick={() => handleComicClick(comic)}>
                                <h2>{comic.title}</h2>
                                <p>Publisher: {comic.publisher}</p>
                                <p>Rating: {comic.rating}</p>
                                <p>Reviews: {comic.reviews}</p>
                                <img
                                    src={comic.image_url ? `http://localhost:5555${comic.image_url}` : 'default-image-url'}
                                    alt={comic.title}
                                />
                                <p>Genres: {comic.genres.join(', ')}</p>
                                <button onClick={(e) => handleDelete(comic.id, e)}>Delete</button>
                            </div>
                        ))
                    ) : (
                        <p>No comic books found.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default ComicBookList;
