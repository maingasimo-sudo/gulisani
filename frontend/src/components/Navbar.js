import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/?search=${search}`);
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <nav style={styles.nav}>
      {/* Top bar */}
      <div style={styles.topBar}>
        <Link to="/" style={styles.logo}>
          🛒 {t('appName')}
        </Link>

        {/* Search bar */}
        <form onSubmit={handleSearch} style={styles.searchForm}>
          <input
            type="text"
            placeholder={t('search')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
          <button type="submit" style={styles.searchButton}>
            {t('searchButton')}
          </button>
        </form>

        {/* Right side */}
        <div style={styles.rightSection}>
          {/* Language switcher */}
          <select
            onChange={(e) => changeLanguage(e.target.value)}
            defaultValue={i18n.language}
            style={styles.languageSelect}
          >
            <option value="en">🇬🇧 EN</option>
            <option value="ny">🇿🇲 NY</option>
            <option value="to">🇿🇲 TO</option>
            <option value="bem">🇿🇲 BEM</option>
          </select>

          {user ? (
            <>
              <Link to="/dashboard" style={styles.navLink}>
                {t('myListings')}
              </Link>
              <button onClick={handleLogout} style={styles.logoutBtn}>
                {t('logout')}
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.navLink}>
                {t('login')}
              </Link>
              <Link to="/signup" style={styles.signupBtn}>
                {t('signup')}
              </Link>
            </>
          )}

          <Link to="/create-listing" style={styles.postAdBtn}>
            + {t('postAd')}
          </Link>
        </div>
      </div>

      {/* Category bar */}
      <div style={styles.categoryBar}>
        {['electronics', 'vehicles', 'property', 'fashion', 'furniture', 'jobs', 'services', 'other'].map((cat) => (
          <Link
            key={cat}
            to={`/?category=${cat}`}
            style={styles.categoryLink}
          >
            {t(cat)}
          </Link>
        ))}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    backgroundColor: '#1565C0',
    color: 'white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  },
  topBar: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 20px',
    gap: '16px',
    flexWrap: 'wrap',
  },
  logo: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '24px',
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
  },
  searchForm: {
    display: 'flex',
    flex: 1,
    minWidth: '200px',
    maxWidth: '500px',
  },
  searchInput: {
    flex: 1,
    padding: '8px 12px',
    fontSize: '14px',
    border: 'none',
    borderRadius: '4px 0 0 4px',
    outline: 'none',
  },
  searchButton: {
    padding: '8px 16px',
    backgroundColor: '#FFA000',
    color: 'white',
    border: 'none',
    borderRadius: '0 4px 4px 0',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginLeft: 'auto',
    flexWrap: 'wrap',
  },
  languageSelect: {
    padding: '6px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '13px',
  },
  navLink: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '14px',
  },
  logoutBtn: {
    backgroundColor: 'transparent',
    color: 'white',
    border: '1px solid white',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  signupBtn: {
    backgroundColor: 'white',
    color: '#1565C0',
    padding: '6px 12px',
    borderRadius: '4px',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  postAdBtn: {
    backgroundColor: '#FFA000',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '4px',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
  },
  categoryBar: {
    display: 'flex',
    backgroundColor: '#0D47A1',
    padding: '8px 20px',
    gap: '20px',
    overflowX: 'auto',
  },
  categoryLink: {
    color: 'rgba(255,255,255,0.85)',
    textDecoration: 'none',
    fontSize: '13px',
    whiteSpace: 'nowrap',
  },
};

export default Navbar;