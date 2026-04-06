import axios from 'axios';
import { URLS } from './urls';

export const THEME_MAP = {
    0: 'theme-ocean',
    1: 'theme-forest',
    2: 'theme-desert',
    3: 'theme-space',
    4: 'theme-sunset'
};

const api = axios.create({
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// --- INTERCEPTORS ---
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
                    const newAccess = response.data.access;
                    
                    localStorage.setItem('access_token', newAccess);
                    api.defaults.headers.common['Authorization'] = `Bearer ${newAccess}`;
                    originalRequest.headers['Authorization'] = `Bearer ${newAccess}`;
                    
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

// --- ERROR EXTRACTOR ---
const extractError = (error) => {
    if (error.response?.data) {
        const data = error.response.data;
        if (data.detail) return data.detail;
        if (data.message) return data.message;
        if (data.error) return data.error;
        
        if (typeof data === 'object') {
            const firstKey = Object.keys(data)[0];
            if (Array.isArray(data[firstKey])) {
                return `${firstKey}: ${data[firstKey][0]}`;
            }
        }
        return typeof data === 'string' ? data : "An unexpected error occurred.";
    }
    return error.message || "Network error. Please try again.";
};

// --- BASE REQUEST HELPERS ---
export const getRequest = async (url, params = {}) => {
    try {
        const response = await api.get(url, { params });
        return response.data;
    } catch (error) {
        throw new Error(extractError(error));
    }
};

export const postRequest = async (url, data, isMultipart = false) => {
    try {
        const config = isMultipart ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
        const response = await api.post(url, data, config);
        return response.data;
    } catch (error) {
        throw new Error(extractError(error));
    }
};

export const patchRequest = async (url, data, isMultipart = false) => {
    try {
        const config = isMultipart ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
        const response = await api.patch(url, data, config);
        return response.data;
    } catch (error) {
        throw new Error(extractError(error));
    }
};

// --- SPECIFIC API CALLS ---
export const initializeCSRF = async () => getRequest(URLS.CSRF);

export const registerUser = async (data) => postRequest(URLS.REGISTER, data);

export const loginUser = async (credentials) => {
    const data = await postRequest(URLS.LOGIN, credentials);
    const accessToken = data?.tokens?.access || data?.access;
    const refreshToken = data?.tokens?.refresh || data?.refresh;

    if (accessToken) {
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', refreshToken);
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    }
    return data;
};

export const verifyOTP = async (email, otp) => {
    const data = await postRequest(URLS.VERIFY_OTP, { email, otp });
    const accessToken = data?.tokens?.access || data?.access;
    const refreshToken = data?.tokens?.refresh || data?.refresh;

    if (accessToken) {
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', refreshToken);
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    }
    return data;
};

export const logoutUser = async () => {
    const refresh = localStorage.getItem('refresh_token');
    try {
        if (refresh) await postRequest(URLS.LOGOUT, { refresh });
    } finally {
        localStorage.clear();
        delete api.defaults.headers.common['Authorization'];
    }
};

// User Profile
export const getUserProfile = () => getRequest(URLS.USER_PROFILE);
export const updateUserProfile = (formData) => patchRequest(URLS.UPDATE_PROFILE, formData, true);
export const toggleShareStatus = () => postRequest(URLS.SHARE_TOGGLE);

// Portfolio Management (Authenticated)
export const submitPortfolio = (data, index = 1) => postRequest(URLS.PORTFOLIO_SUBMIT(index), data);
export const updatePortfolio = (data, index = 1) => postRequest(URLS.PORTFOLIO_UPDATE(index), data);

// NEW: Automatically calculate the next available index for a new portfolio
export const createNewPortfolio = (data, currentPortfolioCount) => {
    const nextIndex = (currentPortfolioCount || 0) + 1;
    return postRequest(URLS.PORTFOLIO_SUBMIT(nextIndex), data);
};

// Portfolio Data (Public)
export const fetchPublicPortfolio = (token = null, index = 1) => {
    const url = token ? URLS.PORTFOLIO_SHARED(token, index) : URLS.PORTFOLIO_DEFAULT(index);
    return getRequest(url);
};

// Dashboard Controls
export const fetchDashboardPortfolios = () => getRequest(URLS.DASHBOARD_PORTFOLIOS);
export const togglePortfolioVisibility = (index) => patchRequest(URLS.TOGGLE_PORTFOLIO(index));

// Forms & Submissions
export const submitContactForm = (data, token = null, index = 1) => {
    const url = token ? URLS.SUBMIT_ENQUIRY_SHARED(token, index) : URLS.SUBMIT_FORM_DEFAULT(index);
    return postRequest(url, data);
};

export const fetchSubmissions = (page = 1) => getRequest(URLS.DASHBOARD_SUBMISSIONS, { page });
export const updateSubmission = (id, data) => patchRequest(URLS.UPDATE_SUBMISSION(id), data);
export const reorderSubmissions = (order) => postRequest(URLS.REORDER_SUBMISSIONS, { order });

export default api;