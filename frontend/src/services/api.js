import axios from 'axios';

const API = axios.create({
baseURL: process.env.NODE_ENV === 'production' ? 'https://gulisani.com/api' : 'http://localhost:5001/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const signup = (data) => API.post('/auth/signup', data);
export const login = (data) => API.post('/auth/login', data);
export const getListings = (params) => API.get('/listings', { params });
export const getListing = (id) => API.get(`/listings/${id}`);
export const createListing = (data) => API.post('/listings', data);
export const updateListing = (id, data) => API.put(`/listings/${id}`, data);
export const deleteListing = (id) => API.delete(`/listings/${id}`);
export const getMyListings = () => API.get('/listings/user/my-listings');
export const getBumpPricing = () => API.get('/bumps/pricing/list');
export const purchaseBump = (data) => API.post('/bumps/purchase', data);
export const getBumpStatus = (listingId) => API.get(`/bumps/status/${listingId}`);
export const checkContactAccess = () => API.get('/contacts/check-access');
export const purchaseContactAccess = (data) => API.post('/contacts/purchase', data);
export const getSellerContact = (listingId) => API.get(`/contacts/listing/${listingId}/seller-contact`);
export const getMyProfile = () => API.get('/users/profile/me');
export const updateProfile = (data) => API.put('/users/profile/update', data);

export default API;