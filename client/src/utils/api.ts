// import axios from 'axios';
// const base = 'http://localhost:3000';

// const api = axios.create({ baseURL: base });

// api.interceptors.request.use((cfg) => {
//     const token = localStorage.getItem('token');
//     if (token) cfg.headers.Authorization = `Bearer ${token}`;
//     return cfg;
// });

// export default api;

import axios from 'axios';

const api = axios.create({
    baseURL: "http://localhost:3000", // your backend
    // withCredentials: true // 🔥 VERY IMPORTANT for sessions
});

export default api;
