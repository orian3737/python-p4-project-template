import React from 'react';
import { Route, Routes, Link, useNavigate } from 'react-router-dom'; 
import ComicBookForm from './ComicBookForm';
import ComicBookList from './ComicBookList';
import About from './About';
import '../styles/index.css';
import { FaSearch } from 'react-icons/fa';

function App() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [activeBubble, setActiveBubble] = React.useState('');
  const navigate = useNavigate(); 

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/search/${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleBubbleClick = (bubble) => {
    setActiveBubble(bubble);
    setTimeout(() => {
      setActiveBubble('');
    }, 500);
  };

  const appStyle = {
    backgroundImage: 'url(/images/Capture2.PNG)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  };

  return (
    <div style={appStyle}>
      <nav>
        <img src="/images/czlogo.jpg" alt="Logo" className="logo" />
        <ul className="nav-list">
          <li className={activeBubble === 'bam' ? 'clicked' : ''}>
            <Link to="/" className="nav-link" onClick={() => handleBubbleClick('bam')}>Home</Link>
            <div className="bubble">BAM!</div>
          </li>
          <li className={activeBubble === 'comicBooks' ? 'clicked' : ''}>
            <Link to="/comicbooks" className="nav-link" onClick={() => handleBubbleClick('comicBooks')}>Comic Books</Link>
            <div className="bubble">BOOM!</div>
          </li>
          <li className={activeBubble === 'pow' ? 'clicked' : ''}>
            <Link to="/about" className="nav-link" onClick={() => handleBubbleClick('pow')}>About</Link>
            <div className="bubble">POW!</div>
          </li>
          <li className="search-container">
            <input
              type="text"
              placeholder="Search Comics..."
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              className="search-input"
            />
            <button onClick={handleSearch} className="search-button">
              <FaSearch />
            </button>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<ComicBookForm />} />
        <Route path="/comicbooks" element={<ComicBookList />} />
        <Route path="/about" element={<About />} />
        <Route path="/search/:searchTerm" element={<ComicBookList />} />
      </Routes>
      <footer className="footer">
        <p>ComiX Zone</p>
        <p>Email: <a href="mailto:RyanMurzyn@Gmail.com">RyanMurzyn@Gmail.com</a></p>
        <p>LinkedIn: <a href="https://www.linkedin.com/in/ryan-murzyn-555275283/" target="_blank" rel="noopener noreferrer">https://www.linkedin.com/in/ryan-murzyn-555275283/</a></p>
        <p>GitHub: <a href="https://github.com/orian3737" target="_blank" rel="noopener noreferrer">https://github.com/orian3737</a></p>
      </footer>
    </div>
  );
}

export default App;
