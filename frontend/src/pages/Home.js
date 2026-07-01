import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ListingCard from '../components/ListingCard';
import { getListings } from '../services/api';

const Home = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const params = new URLSearchParams(location.search);
  const search = params.get('search') || '';
  const category = params.get('category') || '';

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        const res = await getListings({ search, category });
        setListings(res.data.listings);
      } catch (err) {
        setError(t('error'));
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, [search, category]);

  return (
    <div>
      {/* Hero */}
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>🇿🇲 {t('tagline')}</h1>
      </div>

      {/* Filter info */}
      {(search || category) && (
        <div style={styles.filterInfo}>
          {search && <span>🔍 "{search}"</span>}
          {category && <span> | 📂 {t(category)}</span>}
        </div>
      )}

      {/* Listings grid */}
      {loading ? (
        <div style={styles.center}><p>{t('loading')}</p></div>
      ) : error ? (
        <div style={styles.center}><p style={{ color: 'red' }}>{error}</p></div>
      ) : listings.length === 0 ? (
        <div style={styles.center}><p>{t('noListings')}</p></div>
      ) : (
        <div style={styles.grid}>
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  hero: { backgroundColor: '#1565C0', color: 'white', padding: '30px 20px', borderRadius: '8px', marginBottom: '24px', textAlign: 'center' },
  heroTitle: { margin: 0, fontSize: '24px' },
  filterInfo: { marginBottom: '16px', color: '#757575', fontSize: '14px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' },
  center: { textAlign: 'center', padding: '40px', color: '#757575' },
};

export default Home;