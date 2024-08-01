import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/comicBookList.css';

const ComicBookList = () => {
    const [comicBooks, setComicBooks] = useState([]);
    const [selectedComic, setSelectedComic] = useState(null);
    const [editForm, setEditForm] = useState(null); // State for the edit form
    const [searchTerm, setSearchTerm] = useState('');
    const [publishers, setPublishers] = useState([]);
    const [genres, setGenres] = useState([]);
    const { searchTerm: routeSearchTerm } = useParams();

    useEffect(() => {
        const fetchComics = async () => {
            const searchQuery = searchTerm || routeSearchTerm ? `?search=${encodeURIComponent(searchTerm || routeSearchTerm)}` : '';
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

        const fetchPublishers = async () => {
            try {
                const response = await fetch('http://localhost:5555/api/publishers');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setPublishers(data);
            } catch (error) {
                console.error('Error fetching publishers:', error);
            }
        };

        const fetchGenres = async () => {
            try {
                const response = await fetch('http://localhost:5555/api/genres');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setGenres(data);
            } catch (error) {
                console.error('Error fetching genres:', error);
            }
        };

        fetchComics();
        fetchPublishers();
        fetchGenres();
    }, [searchTerm, routeSearchTerm]);

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

    const handleEditClick = (comic) => {
        setEditForm({
            ...comic,
            genre_ids: comic.genres.map(genre => genre.name).join(', '), // Pre-select genres as comma-separated names
            reviews: comic.reviews // Pre-fill reviews
        });
    };

    const handleEditChange = (e) => {
        setEditForm({
            ...editForm,
            [e.target.name]: e.target.value
        });
    };

    const handleGenreChange = (e) => {
        setEditForm({
            ...editForm,
            genre_ids: e.target.value
        });
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();

        // Convert genre names to IDs
        const genreNames = editForm.genre_ids.split(',').map(name => name.trim());
        const genreIds = genres
            .filter(genre => genreNames.includes(genre.name))
            .map(genre => genre.id);

        fetch(`http://localhost:5555/api/comicbooks/${editForm.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: editForm.title,
                rating: editForm.rating,
                image_url: editForm.image_url,
                publisher_id: editForm.publisher_id,
                genre_ids: genreIds,
                reviews: editForm.reviews // Include reviews
            }),
        })
            .then(response => response.json())
            .then(() => {
                setComicBooks(comicBooks.map(comic =>
                    comic.id === editForm.id ? { ...comic, ...editForm } : comic
                ));
                setEditForm(null); // Close the edit form after submission
            })
            .catch(error => console.error('Error updating comic book:', error));
    };

    return (
        <div className="comic-book-list">
            <h1>{searchTerm || routeSearchTerm ? `Search Results for "${searchTerm || routeSearchTerm}"` : 'Comic Books'}</h1>
            {editForm && (
                <div className="edit-form">
                    <h2>Edit Comic Book</h2>
                    <form onSubmit={handleEditSubmit}>
                        <label>
                            Title:
                            <input
                                type="text"
                                name="title"
                                value={editForm.title}
                                onChange={handleEditChange}
                            />
                        </label>
                        <label>
                            Rating:
                            <input
                                type="number"
                                name="rating"
                                value={editForm.rating}
                                onChange={handleEditChange}
                            />
                        </label>
                        <label>
                            Image URL:
                            <input
                                type="text"
                                name="image_url"
                                value={editForm.image_url}
                                onChange={handleEditChange}
                            />
                        </label>
                        <label>
                            Publisher:
                            <select
                                name="publisher_id"
                                value={editForm.publisher_id}
                                onChange={handleEditChange}
                            >
                                <option value="">Select Publisher</option>
                                {publishers.map(publisher => (
                                    <option key={publisher.id} value={publisher.id}>
                                        {publisher.name}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label>
                            Genres:
                            <input
                                type="text"
                                name="genre_ids"
                                value={editForm.genre_ids}
                                onChange={handleGenreChange}
                                placeholder="Enter genres separated by commas"
                            />
                        </label>
                        <label>
                            Reviews:
                            <textarea
                                name="reviews"
                                value={editForm.reviews}
                                onChange={handleEditChange}
                                placeholder="Enter reviews here"
                            />
                        </label>
                        <button type="submit">Update</button>
                        <button type="button" onClick={() => setEditForm(null)}>Cancel</button>
                    </form>
                </div>
            )}
            {comicBooks.length > 0 ? (
                <div className="comic-books-container">
                    {comicBooks.map(comic => (
                        <div className="comic-card" key={comic.id}>
                            <h2>{comic.title}</h2>
                            <p>Publisher: {comic.publisher}</p>
                            <p>Rating: {comic.rating}</p>
                            <p>Reviews: {comic.reviews}</p>
                            <img
                                src={comic.image_url ? `http://localhost:5555${comic.image_url}` : 'default-image-url'}
                                alt={comic.title}
                            />
                            <p>Genres: {comic.genres.map(genre => genre.name).join(', ')}</p>
                            <button onClick={() => handleEditClick(comic)}>Edit</button>
                            <button onClick={(e) => handleDelete(comic.id, e)}>Delete</button>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No comic books found.</p>
            )}
        </div>
    );
};

export default ComicBookList;
