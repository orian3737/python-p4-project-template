import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import '../styles/comicBookStyles.css';

const ComicBookForm = () => {
  const [publishers, setPublishers] = useState([]);
  const [genres, setGenres] = useState([
    { name: 'Action' },
    { name: 'Adventure' },
    { name: 'Fantasy' },
    { name: 'Science Fiction' },
    { name: 'Horror' },
  ]);
  const [newPublisher, setNewPublisher] = useState('');
  const [newGenre, setNewGenre] = useState('');

  useEffect(() => {
    const fetchPublishers = async () => {
      try {
        const response = await fetch('/api/publishers');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setPublishers(data);
      } catch (error) {
        console.error('Failed to fetch publishers:', error);
      }
    };
    fetchPublishers();
  }, []);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('publisher', values.publisher);
    formData.append('rating', values.rating);
    formData.append('image', values.image);
    formData.append('genres[]', values.genres);

    try {
      await axios.post('/api/comicbooks', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      resetForm();
      setNewPublisher('');
      setNewGenre('');
      alert('Comic book added successfully!');
    } catch (error) {
      console.error('Failed to add comic book:', error);
      alert('Error adding comic book. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const validationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    publisher: Yup.string().required('Publisher is required'),
    rating: Yup.number().min(0).max(10).required('Rating is required'),
    genres: Yup.array().min(1, 'At least one genre is required'),
  });

  return (
    <Formik
      initialValues={{
        title: '',
        publisher: '',
        rating: '',
        image: null,
        genres: [],
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ setFieldValue, isSubmitting }) => (
        <Form className="comic-book-form">
          <h1>Comic Book Form</h1>
          <div className="form-group">
                      <label htmlFor="title">Title</label>
                      <Field type="text" id="title" name="title" />
                      <ErrorMessage name="title" component="div" />
                    </div>
          {/* Add New Publisher Section */}
          <div className="form-group">
            <label htmlFor="publisher">Publisher</label>
            <Field as="select" id="publisher" name="publisher">
              <option value="">Select a publisher</option>
              {publishers.map((publisher) => (
                <option key={publisher.id} value={publisher.id}>
                  {publisher.name}
                </option>
              ))}
            </Field>
            <input
              type="text"
              value={newPublisher}
              onChange={(e) => setNewPublisher(e.target.value)}
              placeholder="Add new publisher"
            />
            <button
              type="button"
              onClick={() => {
                if (newPublisher) {
                  setPublishers([...publishers, { id: Date.now(), name: newPublisher }]);
                  setNewPublisher('');
                }
              }}
            >
              Add Publisher
            </button>
            <ErrorMessage name="publisher" component="div" />
          </div>

          {/* Add New Genre Section */}
          <div className="form-group">
            <label htmlFor="genres">Genres</label>
            {genres.map((genre, index) => (
              <div key={index}>
                <label>
                  <Field
                    type="checkbox"
                    name="genres"
                    value={genre.name}
                  />
                  {genre.name}
                </label>
              </div>
            ))}
            <input
              type="text"
              value={newGenre}
              onChange={(e) => setNewGenre(e.target.value)}
              placeholder="Add new genre"
            />
            <button
              type="button"
              onClick={() => {
                if (newGenre) {
                  setGenres([...genres, { name: newGenre }]);
                  setNewGenre('');
                }
              }}
            >
              Add Genre
            </button>
            <ErrorMessage name="genres" component="div" />
          </div>

          {/* Comic Book Form Fields */}
         
          <div className="form-group">
            <label htmlFor="rating">Rating</label>
            <Field type="number" id="rating" name="rating" />
            <ErrorMessage name="rating" component="div" />
          </div>
          <div className="form-group">
            <label htmlFor="image">Image</label>
            <input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={(event) => {
                setFieldValue("image", event.currentTarget.files[0]);
              }}
            />
          </div>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Adding...' : 'Add Comic Book'}
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default ComicBookForm;
