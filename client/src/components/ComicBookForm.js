import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import '../styles/comicBookStyles.css';

const ComicBookForm = () => {
  const [publishers, setPublishers] = useState([]);
  const [genres] = useState([
    { name: 'Action' },
    { name: 'Adventure' },
    { name: 'Fantasy' },
    { name: 'Science Fiction' },
    { name: 'Horror' },
  ]);
  const [newPublisher, setNewPublisher] = useState('');

  useEffect(() => {
    fetch('/api/publishers')
      .then(response => response.json())
      .then(data => setPublishers(data))
      .catch(error => console.error('Error fetching publishers:', error));
  }, []);

  const initialValues = {
    title: '',
    year: '',
    publisher: '',
    genres: [],
    image: null,
    rating: '',
  };

  const validationSchema = Yup.object({
    title: Yup.string().required('Required'),
    year: Yup.number().positive('Must be a positive number').required('Required'),
    publisher: Yup.string().required('Required'),
    genres: Yup.array().min(1, 'Select at least one genre').required('Required'),
    image: Yup.mixed().required('Image is required'),
    rating: Yup.number().min(1, 'Rating must be at least 1').max(5, 'Rating can be at most 5').required('Required'),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('year', values.year);
    formData.append('publisher', values.publisher);
    formData.append('rating', values.rating);
    formData.append('image', values.image);
    values.genres.forEach(genre => formData.append('genres[]', genre));

    try {
      const response = await axios.post('http://localhost:5555/api/comicbooks', formData);
      console.log('Comic book added successfully:', response.data);
      setSubmitting(false);
      resetForm();
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ setFieldValue, isSubmitting }) => (
        <Form className="form-container">
          <h1>Welcome to ComiX Zone</h1>
          <p>
            This is a comic book database that keeps you updated on recent comics from the most popular comic book publishers and popular titles.
          </p>
          <p>
            If you would like to add a new comic or comic book publisher, please feel free to use this form!
          </p>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <Field type="text" name="title" />
            <ErrorMessage name="title" component="div" />
          </div>
          <div className="form-group">
            <label htmlFor="year">Year</label>
            <Field type="number" name="year" />
            <ErrorMessage name="year" component="div" />
          </div>
          <div className="form-group">
            <label htmlFor="publisher">Publisher</label>
            <Field as="select" name="publisher">
              <option value="">Select a publisher</option>
              {publishers.map(publisher => (
                <option key={publisher.id} value={publisher.id}>{publisher.name}</option>
              ))}
            </Field>
            <ErrorMessage name="publisher" component="div" />
          </div>
          <div className="form-group">
            <label>Genres</label>
            {genres.map(genre => (
              <div key={genre.name}>
                <label>
                  <Field type="checkbox" name="genres" value={genre.name} />
                  {genre.name}
                </label>
              </div>
            ))}
            <ErrorMessage name="genres" component="div" />
          </div>
          <div className="form-group">
            <label htmlFor="image">Image</label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={(event) => setFieldValue('image', event.currentTarget.files[0])}
            />
            <ErrorMessage name="image" component="div" />
          </div>
          <div className="form-group">
            <label htmlFor="rating">Rating</label>
            <Field type="number" name="rating" />
            <ErrorMessage name="rating" component="div" />
          </div>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default ComicBookForm;
