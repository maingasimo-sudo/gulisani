import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { createListing } from '../services/api';
import { useAuth } from '../context/AuthContext';

const CreateListing = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', description: '', category: 'electronics',
    price: '', imageUrl: '', location: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!user) {
    return (
      <div style={styles.center}>
        <p>Please <a href="/login" style={{ color: '#1565C0' }}>login</a> to post an ad.</p>
      </div>
    );
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await createListing(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || t('error'));
    } finally {
      setLoading(false);
    }
  };

  const categories = ['electronics', 'vehicles', 'property', 'fashion', 'furniture', 'jobs', 'services', 'other'];

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>{t('createListing')}</h2>
        {error && <div style={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>{t('title')} *</label>
            <input type="text" name="title" value={form.title} onChange={handleChange} style={styles.input} required />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>{t('category')} *</label>
            <select name="category" value={form.category} onChange={handleChange} style={styles.input}>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{t(cat)}</option>
              ))}
            </select>
          </div>
          <div style={styles.field}>
            <label style={styles.label}>{t('price')} (ZMW) *</label>
            <input type="number" name="price" value={form.price} onChange={handleChange} style={styles.input} required />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>{t('description')}</label>
            <textarea name="description" value={form.description} onChange={handleChange} style={{ ...styles.input, height: '100px', resize: 'vertical' }} />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>{t('imageUrl')}</label>
            <input type="url" name="imageUrl" value={form.imageUrl} onChange={handleChange} style={styles.input} placeholder="https://..." />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>{t('location')}</label>
            <input type="text" name="location" value={form.location} onChange={handleChange} style={styles.input} placeholder="e.g. Lusaka, Kitwe..." />
          </div>
          <div style={styles.buttons}>
            <button type="button" onClick={() => navigate('/')} style={styles.cancelBtn}>{t('cancel')}</button>
            <button type="submit" style={styles.submitBtn} disabled={loading}>
              {loading ? t('loading') : t('submit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', justifyContent: 'center' },
  card: { backgroundColor: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', width: '100%', maxWidth: '600px' },
  title: { color: '#1565C0', marginBottom: '24px' },
  error: { backgroundColor: '#FFEBEE', color: '#C62828', padding: '10px', borderRadius: '4px', marginBottom: '16px', fontSize: '14px' },
  field: { marginBottom: '16px' },
  label: { display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#424242' },
  input: { width: '100%', padding: '10px 12px', border: '1px solid #E0E0E0', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box', outline: 'none' },
  buttons: { display: 'flex', gap: '12px', marginTop: '24px' },
  cancelBtn: { flex: 1, padding: '12px', backgroundColor: 'white', color: '#757575', border: '1px solid #E0E0E0', borderRadius: '4px', fontSize: '14px', cursor: 'pointer' },
  submitBtn: { flex: 2, padding: '12px', backgroundColor: '#1565C0', color: 'white', border: 'none', borderRadius: '4px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' },
  center: { textAlign: 'center', padding: '40px' },
};

export default CreateListing;