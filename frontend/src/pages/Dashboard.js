import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { getMyListings, deleteListing } from '../services/api';

const Dashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    fetchMyListings();
  }, [user]);

  const fetchMyListings = async () => {
    try {
      const res = await getMyListings();
      setListings(res.data.listings);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this listing?')) return;
    try {
      await deleteListing(id);
      setListings(listings.filter((l) => l.id !== id));
    } catch (err) {
      alert(t('error'));
    }
  };

  return (
    <div>
      <div style={styles.header}>
        <h2 style={styles.title}>{t('dashboard')}</h2>
        <Link to="/create-listing" style={styles.postBtn}>+ {t('postAd')}</Link>
      </div>

      {loading ? (
        <p>{t('loading')}</p>
      ) : listings.length === 0 ? (
        <div style={styles.empty}>
          <p>{t('noListings')}</p>
          <Link to="/create-listing" style={styles.postBtn}>+ {t('postAd')}</Link>
        </div>
      ) : (
        <div style={styles.list}>
          {listings.map((listing) => (
            <div key={listing.id} style={styles.item}>
              {listing.image_url && (
                <img src={listing.image_url} alt={listing.title} style={styles.thumbnail}
                  onError={(e) => { e.target.style.display = 'none'; }} />
              )}
              <div style={styles.info}>
                <h3 style={styles.itemTitle}>{listing.title}</h3>
                <p style={styles.itemPrice}>ZMW {Number(listing.price).toLocaleString()}</p>
                <p style={styles.itemMeta}>📍 {listing.location} | {t(listing.category)}</p>
              </div>
              <div style={styles.actions}>
                <Link to={`/listing/${listing.id}`} style={styles.viewBtn}>View</Link>
                <button onClick={() => handleDelete(listing.id)} style={styles.deleteBtn}>
                  {t('deleteListing')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  title: { color: '#1565C0', margin: 0 },
  postBtn: { backgroundColor: '#FFA000', color: 'white', padding: '10px 20px', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold' },
  empty: { textAlign: 'center', padding: '40px', color: '#757575' },
  list: { display: 'flex', flexDirection: 'column', gap: '12px' },
  item: { display: 'flex', alignItems: 'center', gap: '16px', backgroundColor: 'white', padding: '16px', borderRadius: '8px', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' },
  thumbnail: { width: '80px', height: '60px', objectFit: 'cover', borderRadius: '4px' },
  info: { flex: 1 },
  itemTitle: { margin: '0 0 4px', fontSize: '16px', color: '#212121' },
  itemPrice: { margin: '0 0 4px', color: '#1565C0', fontWeight: 'bold' },
  itemMeta: { margin: 0, fontSize: '12px', color: '#757575' },
  actions: { display: 'flex', flexDirection: 'column', gap: '8px' },
  viewBtn: { backgroundColor: '#1565C0', color: 'white', padding: '6px 12px', borderRadius: '4px', textDecoration: 'none', fontSize: '13px', textAlign: 'center' },
  deleteBtn: { backgroundColor: 'white', color: '#C62828', border: '1px solid #C62828', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' },
};

export default Dashboard;