import React from 'react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer style={styles.footer}>
      <div style={styles.content}>
        <div style={styles.section}>
          <h3 style={styles.heading}>🛒 {t('appName')}</h3>
          <p style={styles.tagline}>{t('tagline')}</p>
        </div>
        <div style={styles.section}>
          <p style={styles.copy}>© 2026 Gulisani. All rights reserved.</p>
          <p style={styles.copy}>Made with ❤️ for Zambia 🇿🇲</p>
        </div>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: '#0D47A1',
    color: 'white',
    marginTop: '40px',
    padding: '30px 20px',
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '20px',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  heading: {
    margin: 0,
    fontSize: '20px',
  },
  tagline: {
    margin: 0,
    fontSize: '14px',
    color: 'rgba(255,255,255,0.8)',
  },
  copy: {
    margin: 0,
    fontSize: '13px',
    color: 'rgba(255,255,255,0.7)',
  },
};

export default Footer;