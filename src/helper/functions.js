import axios from 'axios';
import { createElement } from 'react';
import { Component } from 'lucide-react';
import { DynamicIcon, iconNames } from 'lucide-react/dynamic';
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

const normalizeIconName = (value = "") => value.replace(/[-_\s]/g, "").toLowerCase();
const iconNameMap = new Map(iconNames.map((name) => [normalizeIconName(name), name]));

export const resolveIcon = (iconName, fallback = Component) => {
    if (typeof iconName === "function") return iconName;

    const resolvedName = iconNameMap.get(normalizeIconName(iconName));
    if (!resolvedName) return fallback;

    return function ResolvedLucideIcon(props) {
        return createElement(DynamicIcon, {
            ...props,
            name: resolvedName,
            fallback,
        });
    };
};

const api = axios.create({
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

const clearAuthSession = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_info');
    delete api.defaults.headers.common['Authorization'];
};

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token && !config.skipAuth) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (originalRequest?.skipAuthRedirect) {
            return Promise.reject(error);
        }

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
                    clearAuthSession();
                    window.location.href = '/login';
                }
            } else {
                clearAuthSession();
            }
        }
        return Promise.reject(error);
    }
);

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
    normalizedError.status = error.response?.status;
    return normalizedError;
};

const unwrapResponseData = (responseData) => responseData?.data ?? responseData;

const ensureArray = (value) => (Array.isArray(value) ? value : []);

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

export const getRequest = async (url, params = {}, config = {}) => {
    try {
        const response = await api.get(url, { ...config, params });
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

export const initializeCSRF = async () => getRequest(URLS.CSRF);

export const registerUser = async (data) => {
    try {
        return await postRequest(URLS.REGISTER, data);
    } catch (error) {
        if (error.status === 400 && data.email) {
            await requestOTP(data.email);
            return {
                requiresVerification: true,
                email: data.email,
                message: error.message || "Proceeding to verification."
            };
        }
        throw error;
    }
};

export const requestOTP = async (email) => postRequest(URLS.REQUEST_OTP, { email });

export const forgotPassword = async (email) => postRequest(URLS.FORGOT_PASSWORD, { email });
export const resetPassword = async (data) => postRequest(URLS.RESET_PASSWORD, data);


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

export const loginWithGoogle = async (credential) => {
    const data = await postRequest(URLS.GOOGLE_LOGIN, { credential });
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
        clearAuthSession();
    }
};

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

export const fetchPortfolioAuthenticated = (index = 1) => {
    return getRequest(URLS.PORTFOLIO_GET_AUTHENTICATED(index)).then(normalizePortfolioDocument);
};

export const updatePortfolio = async (data, index = 1) => {
    const response = await patchRequest(URLS.PORTFOLIO_UPDATE(index), data);
    return normalizePortfolioDocument(response);
};

export const createNewPortfolio = async (data, index = 1) => {
    const response = await postRequest(URLS.PORTFOLIO_SUBMIT(index), data);
    return normalizePortfolioDocument(response);
};

export const fetchPortfolio = (token = null, index = 1) => {
    const url = token ? URLS.PORTFOLIO_SHARED(token, index) : URLS.PORTFOLIO_DEFAULT(index);
    return getRequest(url, {}, { skipAuth: true, skipAuthRedirect: true }).then(normalizePortfolioDocument);
};
export const fetchPublicPortfolio = (token = null, index = 1) => fetchPortfolio(token, index);

export const fetchDashboardPortfolios = () => getRequest(URLS.PORTFOLIOS_ALL);
export const togglePortfolioVisibility = async (index) => {
    const response = await patchRequest(URLS.TOGGLE_PORTFOLIO(index));
    return unwrapResponseData(response);
};

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