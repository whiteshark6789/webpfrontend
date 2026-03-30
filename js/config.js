// API URL - switches automatically between local and production
const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:5000'
  : 'https://webpbackend.onrender.com';
