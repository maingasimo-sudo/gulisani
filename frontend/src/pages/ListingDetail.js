import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { getListing, getSellerContact, checkContactAccess } from '../services/api';

const ListingDetail = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const { user } = useAuth();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [contact, setContact] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getListing(id);
        setListing(res.data.listing);
        if (user) {
          const accessRes = await checkContactAccess();
          setHasAccess(accessRes.data.hasAccess);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, user]);

  const handleRevealContact = async () => {
    setContactLoading(true);
    try {
      const res = await getSellerContact(id);
      setContact(res.data.sellerContact);
    } catch (err) {
      alert(err.response?.data?.error || t('error'));
    } finally {
      setContactLoading(false);
    }
  };

  if (loading) return <div style={styles.center}><p>{t('loading')}</p></div>;
  if (!listing) return <div style={styles.center}><p>{t('error')}</p></div>;

  return (
    <div style={styles.container}>
      {/* Image */}
      <div style={styles.imageContainer}>
        {listing.image_url ? (
          <img src={listing.image_url} alt={listing.title} style={styles.image}
            onError={(e) => { e.target.src = 'https://via.placeholder.com/600x400?text=No+Image'; }} />
        ) : (
          <div style={styles.noImage}>📷 No Image</div>
        )}
      </div>

      {/* Details */}
      <div style={styles.details}>
        <div style={styles.mainInfo}>
          <h1 style={styles.title}>{listing.title}</h1>
          <p style={styles.price}>ZMW {Number(listing.price).toLocaleString()}</p>
          <div style={styles.meta}>
            <span>📍 {listing.location || 'Zambia'}</span>
            <span>📂 {t(listing.category)}</span>
            {listing.isBumped && <span style={styles.featuredBadge}>⭐ {t('featured')}</span>}
          </div>
          <div style={styles.description}>
            <h3>{t('description')}</h3>
            <p>{listing.description || 'No description provided.'}</p>
          </div>
        </div>

        {/* Contact section */}
        <div style={styles.contactBox}>
          <h3 style={styles.contactTitle}>{t('contact')}</h3>
          {!user ? (
            <p>Please <Link to="/login" style={{ color: '#1565C0' }}>login</Link> to contact the seller.</p>
          ) : contact ? (
            <div style={styles.contactInfo}>
              {contact.phone && <p>📞 {contact.phone}</p>}
              {contact.email && <p>✉️ {contact.email}</p>}
            </div>
          ) : hasAccess ? (
            <button onClick={handleRevealContact} style={styles.contactBtn} disabled={contactLoading}>
              {contactLoading ? t('loading') : t('viewContact')}
            </button>
          ) : (
            <div>
              <p style={{ fontSize: '14px', color: '#757575' }}>
                Purchase contact access to view seller details.
              </p>
              <Link to="/login" style={styles.purchaseBtn}>{t('purchaseAccess')}</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: '900px', margin: '0 auto' },
  center: { textAlign: 'center', padding: '40px' },
  imageContainer: { width: '100%', height: '400px', backgroundColor: '#f5f5f5', borderRadius: '8px', overflow: 'hidden', marginBottom: '24px' },
  image: { width: '100%', height: '100%', objectFit: 'cover' },
  noImage: { display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#ccc', fontSize: '24px' },
  details: { display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px' },
  mainInfo: { backgroundColor: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' },
  title: { margin: '0 0 12px', color: '#212121', fontSize: '24px' },
  price: { fontSize: '28px', fontWeight: 'bold', color: '#1565C0', margin: '0 0 16px' },
  meta: { display: 'flex', gap: '16px', color: '#757575', fontSize: '14px', marginBottom: '20px', flexWrap: 'wrap' },
  featuredBadge: { backgroundColor: '#FFA000', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' },
  description: { borderTop: '1px solid #f5f5f5', paddingTop: '16px' },
  contactBox: { backgroundColor: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 4px rgba(0,0,0,0.1)', height: 'fit-content' },
  contactTitle: { color: '#1565C0', marginTop: 0 },
  contactInfo: { backgroundColor: '#E3F2FD', padding: '16px', borderRadius: '4px' },
  contactBtn: { width: '100%', padding: '12px', backgroundColor: '#1565C0', color: 'white', border: 'none', borderRadius: '4px', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold' },
  purchaseBtn: { display: 'block', textAlign: 'center', padding: '12px', backgroundColor: '#FFA000', color: 'white', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold', marginTop: '8px' },
};

export default ListingDetail;