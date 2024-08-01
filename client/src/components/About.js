import React from 'react';
import '../styles/about.css'; 

const About = () => {
  return (
    <div className="about-container">
      <h1>About Comic Zone</h1>
      <section className="about-section">
        <h2>Overview</h2>
        <p>
          Comic Zone is a comic book management app that provides users with access to the most current comics from the most popular artists and publishers. Our goal is to keep you updated on the latest titles and trends in the comic book world.
        </p>
      </section>
      <section className="about-section">
        <h2>Future Plans</h2>
        <p>
          Comic Zone is continuously evolving. Future updates will include features such as user authentication and personal user profiles, allowing users to store their own comic book collections along with grading values and contents.
        </p>
        <p>
          We also plan to add a grading guide and system, a review section for users to share their thoughts on comics, and a blog where users can discuss their collections and other comic-related interests.
        </p>
      </section>
      <section className="about-section">
        <h2>Stay Connected</h2>
        <p>
          For updates and more information, you can reach out to us through the following channels:
        </p>
        <ul>
          <li>Email: <a href="mailto:RyanMurzyn@Gmail.com">RyanMurzyn@Gmail.com</a></li>
          <li>LinkedIn: <a href="https://www.linkedin.com/in/ryan-murzyn-555275283/" target="_blank" rel="noopener noreferrer">Ryan Murzyn</a></li>
          <li>GitHub: <a href="https://github.com/orian3737" target="_blank" rel="noopener noreferrer">Ryan's GitHub</a></li>
        </ul>
      </section>
    </div>
  );
};

export default About;
