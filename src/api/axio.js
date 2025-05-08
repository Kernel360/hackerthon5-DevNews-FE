import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080",
});

// 모든 요청에 JWT 토큰을 자동으로 추가
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); // 또는 'accessToken' 등 실제 저장된 key로 변경
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;