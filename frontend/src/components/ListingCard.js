import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ListingCard = ({ listing }) => {
  const { t } = useTranslation();

  return (
    <Link to={`/listing/${listing.id}`} style={styles.card}>
      {/* Image */}
      <div style={styles.imageContainer}>
        {listing.image_url ? (
          <img
            src={listing.image_url}
            alt={listing.title}
            style={styles.image}
            onError={(e) => { e.target.src = 'https://via.placeholder.com/300x200?text=No+Image'; }}
          />
        ) : (
          <div style={styles.noImage}>📷</div>
        )}
        {listing.isBumped && (
          <span style={styles.featuredBadge}>⭐ {t('featured')}</span>
        )}
      </div>

      {/* Details */}
      <div style={styles.details}>
        <h3 style={styles.title}>{listing.title}</h3>
        <p style={styles.price}>ZMW {Number(listing.price).toLocaleString()}</p>
        <div style={styles.meta}>
          <span style={styles.location}>📍 {listing.location || 'Zambia'}</span>
          <span style={styles.category}>{t(listing.category)}</span>
        </div>
      </div>
    </Link>
  );
};

const styles = {
  card: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
    textDecoration: 'none',
    color: 'inherit',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'pointer',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: '180px',
    backgroundColor: '#f5f5f5',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  noImage: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    fontSize: '40px',
    color: '#ccc',
  },
  featuredBadge: {
    position: 'absolute',
    top: '8px',
    left: '8px',
    backgroundColor: '#FFA000',
    color: 'white',
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  details: {
    padding: '12px',
  },
  title: {
    margin: '0 0 6px 0',
    fontSize: '15px',
    fontWeight: '600',
    color: '#212121',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  price: {
    margin: '0 0 8px 0',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#1565C0',
  },
  meta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  location: {
    fontSize: '12px',
    color: '#757575',
  },
  category: {
    fontSize: '11px',
    backgroundColor: '#E3F2FD',
    color: '#1565C0',
    padding: '2px 8px',
    borderRadius: '12px',
  },
};

export default ListingCard;