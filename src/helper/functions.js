import axios from 'axios';
import { URLS } from './urls';

export const THEME_MAP = {
    0: 'theme-ocean',
    1: 'theme-forest',
    2: 'theme-desert',
    3: 'theme-space',
    4: 'theme-sunset'
};

export const TIER_MAP = {
    0: 'Free',
    1: 'Pro',
    2: 'Premium',
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
                } catch {
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

const createRequestError = (error) => {
    const normalizedError = new Error(extractError(error));
    normalizedError.details = error.response?.data;
    return normalizedError;
};

const unwrapResponseData = (responseData) => responseData?.data ?? responseData;

const ensureArray = (value) => (Array.isArray(value) ? value : []);

const normalizePortfolioCollection = (value) => {
    if (Array.isArray(value)) return value;
    if (Array.isArray(value?.results)) return value.results;
    return [];
};

const normalizePortfolioDocument = (payload = {}) => {
    const document = unwrapResponseData(payload) || {};

    return {
        ...document,
        orderIndex: document.orderIndex ?? document.order_index ?? document.new_order_index,
        isEnabled: document.isEnabled ?? document.is_enabled,
        themeMode: document.themeMode ?? document.theme_mode,
        personalInfo: document.personalInfo || {},
        heroContent: document.heroContent || {},
        heroActions: {
            primary: document.heroActions?.primary || {},
            secondary: document.heroActions?.secondary || {},
        },
        aboutContent: document.aboutContent || {},
        heroFocus: {
            ...(document.heroFocus || {}),
            areas: ensureArray(document.heroFocus?.areas),
        },
        heroBadges: ensureArray(document.heroBadges),
        heroHighlights: ensureArray(document.heroHighlights),
        navigationLinks: ensureArray(document.navigationLinks),
        heroMetrics: ensureArray(document.heroMetrics),
        skillGroups: ensureArray(document.skillGroups),
        projects: Array.isArray(document.projects) || Array.isArray(document?.projects?.results)
            ? document.projects
            : [],
        experience: Array.isArray(document.experience) || Array.isArray(document?.experience?.results)
            ? document.experience
            : [],
        showcaseCategories: ensureArray(document.showcaseCategories).map((item) => ({
            ...item,
            icon: item?.icon || item?.iconName || item?.icon_name || "Component",
        })),
        featuredModules: ensureArray(document.featuredModules).map((item) => ({
            ...item,
            icon: item?.icon || item?.iconName || item?.icon_name || "Blocks",
        })),
        contactMethods: ensureArray(document.contactMethods).map((item) => ({
            ...item,
            icon: item?.icon || item?.iconName || item?.icon_name || "Mail",
        })),
        footerLinks: ensureArray(document.footerLinks),
        statusPills: ensureArray(document.statusPills).map((item) => ({
            ...item,
            icon: item?.icon || item?.iconName || item?.icon_name || "Component",
        })),
        sectionCopy: document.sectionCopy || {},
        pageCopy: document.pageCopy || {},
    };
};

// --- BASE REQUEST HELPERS ---
export const getRequest = async (url, params = {}) => {
    try {
        const response = await api.get(url, { params });
        return response.data;
    } catch (error) {
        throw createRequestError(error);
    }
};

export const postRequest = async (url, data, isMultipart = false) => {
    try {
        const config = {
            headers: isMultipart ? {} : { 'Content-Type': 'application/json' }
        };
        if (isMultipart) {
            config.transformRequest = [(data) => data];
        }
        const response = await api.post(url, data, config);
        return response.data;
    } catch (error) {
        throw createRequestError(error);
    }
};

export const patchRequest = async (url, data, isMultipart = false) => {
    try {
        const config = {
            headers: isMultipart ? {} : { 'Content-Type': 'application/json' }
        };
        if (isMultipart) {
            config.transformRequest = [(data) => data];
        }
        const response = await api.patch(url, data, config);
        return response.data;
    } catch (error) {
        throw createRequestError(error);
    }
};

// --- SPECIFIC API CALLS ---
export const initializeCSRF = async () => getRequest(URLS.CSRF);

export const registerUser = async (data) => postRequest(URLS.REGISTER, data);
export const requestOTP = async (email) => postRequest(URLS.REQUEST_OTP, { email });

const extractAuthPayload = (responseData) => ({
    ...(responseData || {}),
    ...(responseData?.data || {}),
});

const persistAuthSession = (responseData) => {
    const payload = extractAuthPayload(responseData);
    const accessToken = responseData?.tokens?.access || payload?.tokens?.access || payload?.access;
    const refreshToken = responseData?.tokens?.refresh || payload?.tokens?.refresh || payload?.refresh;

    if (!accessToken) return responseData;

    localStorage.setItem('access_token', accessToken);
    if (refreshToken) {
        localStorage.setItem('refresh_token', refreshToken);
    }
    localStorage.setItem('user_info', JSON.stringify({
        user_id: payload?.user_id,
        email: payload?.email,
        username: payload?.username,
        enable_share_token: payload?.enable_share_token,
        share_token: payload?.share_token,
    }));
    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    return responseData;
};

export const loginUser = async (credentials) => {
    const data = await postRequest(URLS.LOGIN, credentials);
    return persistAuthSession(data);
};

export const verifyOTP = async (email, otp) => {
    const data = await postRequest(URLS.VERIFY_OTP, { email, otp });
    return persistAuthSession(data);
};

export const logoutUser = async () => {
    const refresh = localStorage.getItem('refresh_token');
    try {
        if (refresh) await postRequest(URLS.LOGOUT, { refresh });
    } finally {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_info');
        delete api.defaults.headers.common['Authorization'];
    }
};

// --- USER PROFILE ---
export const getUserProfile = () => getRequest(URLS.USER_PROFILE);
export const updateUserProfile = (formData) =>
    patchRequest(
        URLS.UPDATE_PROFILE,
        formData,
        typeof FormData !== "undefined" && formData instanceof FormData
    );
export const toggleShareStatus = async (data = {}) => {
    const response = await patchRequest(URLS.SHARE_TOGGLE, data);
    return unwrapResponseData(response);
};

// --- PORTFOLIO MANAGEMENT (AUTHENTICATED) ---
export const updatePortfolio = async (data, index = 1) => {
    const response = await patchRequest(URLS.PORTFOLIO_UPDATE(index), data);
    return normalizePortfolioDocument(response);
};

export const createNewPortfolio = async (data, index = 1) => {
    const response = await postRequest(URLS.PORTFOLIO_SUBMIT(index), data);
    return normalizePortfolioDocument(response);
};

// --- PORTFOLIO DATA (PUBLIC) ---
export const fetchPortfolio = (token = null, index = 1) => {
    const url = token ? URLS.PORTFOLIO_SHARED(token, index) : URLS.PORTFOLIO_DEFAULT(index);
    return getRequest(url).then(normalizePortfolioDocument);
};
export const fetchPublicPortfolio = (token = null, index = 1) => fetchPortfolio(token, index);

// --- DASHBOARD CONTROLS ---
export const fetchDashboardPortfolios = () => getRequest(URLS.PORTFOLIOS_ALL);
export const togglePortfolioVisibility = async (index) => {
    const response = await patchRequest(URLS.TOGGLE_PORTFOLIO(index));
    return unwrapResponseData(response);
};

// --- FORMS & SUBMISSIONS ---
export const submitContactForm = (data, token = null, index = 1) => {
    const url = token ? URLS.SUBMIT_ENQUIRY_SHARED(token, index) : URLS.SUBMIT_FORM_DEFAULT(index);
    return postRequest(url, data);
};

export const fetchSubmissions = (page = 1) => getRequest(URLS.DASHBOARD_SUBMISSIONS, { page });
export const updateSubmission = async (id, data) => {
    const response = await patchRequest(URLS.UPDATE_SUBMISSION(id), data);
    return unwrapResponseData(response);
};
export const reorderSubmissions = (order) => postRequest(URLS.REORDER_SUBMISSIONS, { order });

export default api;
