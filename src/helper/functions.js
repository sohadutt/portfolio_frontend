import axios from 'axios';
import { URLS } from './urls';

const api = axios.create({
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refresh_token');
            
            if (refreshToken) {
                try {
                    const response = await axios.post(URLS.REFRESH_TOKEN, { refresh: refreshToken });
                    localStorage.setItem('access_token', response.data.access);
                    api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
                    return api(originalRequest);
                } catch (refreshError) {
                    localStorage.clear();
                    window.location.href = '/login';
                }
            }
        }
        return Promise.reject(error);
    }
);

// --- Core HTTP Methods ---

export const getRequest = async (url, params = {}) => {
    try {
        const response = await api.get(url, { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const postRequest = async (url, data) => {
    try {
        const response = await api.post(url, data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const patchRequest = async (url, data, isMultipart = false) => {
    try {
        const config = isMultipart ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
        const response = await api.patch(url, data, config);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// --- Authentication ---

export const initializeCSRF = async () => {
    return await getRequest(URLS.CSRF);
};

export const registerUser = async (data) => {
    return await postRequest(URLS.REGISTER, data);
};

export const loginUser = async (credentials) => {
    const data = await postRequest(URLS.LOGIN, credentials);
    if (data.data?.tokens) {
        localStorage.setItem('access_token', data.data.tokens.access);
        localStorage.setItem('refresh_token', data.data.tokens.refresh);
    }
    return data;
};

export const requestOTP = async (email) => {
    return await postRequest(URLS.REQUEST_OTP, { email });
};

export const verifyOTP = async (email, otp) => {
    const data = await postRequest(URLS.VERIFY_OTP, { email, otp });
    if (data.tokens) {
        localStorage.setItem('access_token', data.tokens.access);
        localStorage.setItem('refresh_token', data.tokens.refresh);
    }
    return data;
};

export const logoutUser = async () => {
    const refresh = localStorage.getItem('refresh_token');
    try {
        await postRequest(URLS.LOGOUT, { refresh });
    } finally {
        localStorage.clear();
    }
};

// --- Profile & Portfolio ---

export const fetchProfile = () => getRequest(URLS.USER_PROFILE);

export const updateProfile = (formData) => patchRequest(URLS.UPDATE_PROFILE, formData, true);

export const toggleShareStatus = () => postRequest(URLS.SHARE_TOGGLE);

export const savePortfolio = (data) => postRequest(URLS.PORTFOLIO_SAVE, data);

// --- Public Access ---

export const fetchPublicPortfolio = (token = null) => {
    const url = token ? URLS.PORTFOLIO_SHARED(token) : URLS.PORTFOLIO_DEFAULT;
    return getRequest(url);
};

export const submitContactForm = (data, token = null) => {
    const url = token ? URLS.SUBMIT_ENQUIRY_SHARED(token) : URLS.SUBMIT_FORM_DEFAULT;
    return postRequest(url, data);
};

// --- Dashboard ---

export const fetchSubmissions = (page = 1) => getRequest(URLS.DASHBOARD_SUBMISSIONS, { page });

export const updateSubmission = (id, data) => patchRequest(URLS.UPDATE_SUBMISSION(id), data);

export const reorderSubmissions = (order) => postRequest(URLS.REORDER_SUBMISSIONS, { order });

export default api;