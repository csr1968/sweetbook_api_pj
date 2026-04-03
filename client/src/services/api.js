import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 인증
export const loginUser = (data) => api.post('/auth/login', data);
export const registerUser = (data) => api.post('/auth/register', data);
export const googleLoginUser = (data) => api.post('/auth/google', data);
export const getMe = (token) =>
  api.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } });

// 사진 업로드
export const uploadPhotos = (files) => {
  const formData = new FormData();
  files.forEach((file) => formData.append('photos', file));
  return api.post('/upload/photos', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// LLM으로 가이드북 콘텐츠 생성
export const generateContent = (tripData) =>
  api.post('/llm/generate', tripData);

// 책 생성 관련
export const createBook = (bookData) => api.post('/books/create', bookData);
export const getBook = (bookUid) => api.get(`/books/${bookUid}`);

// 주문 관련
export const estimateOrder = (bookUid, quantity = 1) =>
  api.post('/orders/estimate', { items: [{ bookUid, quantity }] });

export const createOrder = (bookUid, quantity = 1, shipping) =>
  api.post('/orders', { items: [{ bookUid, quantity }], shipping });

export const getOrders = () => api.get('/orders');

// 템플릿 목록
export const getTemplates = () => api.get('/templates');
