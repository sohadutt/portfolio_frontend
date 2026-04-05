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
        const config = {
            headers: isMultipart ? {} : { 'Content-Type': 'application/json' }
        };

        if (isMultipart) {
            delete config.headers['Content-Type'];
        }

        const response = await api.patch(url, data, config);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const initializeCSRF = async () => getRequest(URLS.CSRF);
export const registerUser = async (data) => postRequest(URLS.REGISTER, data);

export const loginUser = async (credentials) => {
    const data = await postRequest(URLS.LOGIN, credentials);
    let accessToken = null;
    let refreshToken = null;

    if (data?.tokens) {
        accessToken = data.tokens.access;
        refreshToken = data.tokens.refresh;
    } else if (data?.access) {
        accessToken = data.access;
        refreshToken = data.refresh;
    }

    if (accessToken) {
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', refreshToken);
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    }
    return data;
};

export const verifyOTP = async (email, otp) => {
    const data = await postRequest(URLS.VERIFY_OTP, { email, otp });
    let accessToken = data?.access || data?.tokens?.access;
    let refreshToken = data?.refresh || data?.tokens?.refresh;

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

export const get_user_profile = () => getRequest(URLS.USER_PROFILE);
export const update_user_profile = (formData, isMultipart = false) => patchRequest(URLS.UPDATE_PROFILE, formData, isMultipart);
export const status_share_token = () => postRequest(URLS.SHARE_TOGGLE);
export const update_portfolio = (data) => postRequest(URLS.PORTFOLIO_SAVE, data);

export const fetchPublicPortfolio = (token = null) => {
    const url = token ? URLS.PORTFOLIO_SHARED(token) : URLS.PORTFOLIO_DEFAULT;
    return getRequest(url);
};

export const submitContactForm = (data, token = null) => {
    const url = token ? URLS.SUBMIT_ENQUIRY_SHARED(token) : URLS.SUBMIT_FORM_DEFAULT;
    return postRequest(url, data);
};

export const fetchSubmissions = (page = 1) => getRequest(URLS.DASHBOARD_SUBMISSIONS, { page });
export const updateSubmission = (id, data) => patchRequest(URLS.UPDATE_SUBMISSION(id), data);
export const reorderSubmissions = (order) => postRequest(URLS.REORDER_SUBMISSIONS, { order });

export default api;