const BASE_URL = 'http://localhost:8000';

export const URLS = {
    // ---- Authentications & Security ----
    CSRF: `${BASE_URL}/api/csrf/`,
    REGISTER: `${BASE_URL}/api/auth/register/`,
    LOGIN: `${BASE_URL}/api/auth/login/`,
    LOGOUT: `${BASE_URL}/api/auth/logout/`,
    REQUEST_OTP: `${BASE_URL}/api/auth/otp/request/`,
    VERIFY_OTP: `${BASE_URL}/api/auth/otp/verify/`,
    REFRESH_TOKEN: `${BASE_URL}/api/auth/refresh/`,

    // ---- User Profile & Management ----
    USER_PROFILE: `${BASE_URL}/api/profile/`,
    UPDATE_PROFILE: `${BASE_URL}/api/profile/update/`,
    SHARE_TOGGLE: `${BASE_URL}/api/profile/share-toggle/`,
    GET_PUBLIC_TOKEN: `${BASE_URL}/api/profile/get-token/`,

    // ---- Portfolio Viewing (Public) ----
    PORTFOLIO_DEFAULT: `${BASE_URL}/api/portfolio/default/`,
    // Usage: URLS.PORTFOLIO_SHARED('some-token')
    PORTFOLIO_SHARED: (token) => `${BASE_URL}/api/portfolio/shared/${token}/`,

    // ---- Portfolio Management (Authenticated) ----
    PORTFOLIO_SAVE: `${BASE_URL}/api/portfolio/save/`,

    // ---- Contact Form Submissions (Public) ----
    SUBMIT_FORM_DEFAULT: `${BASE_URL}/api/forms/submit/default/`,
    // Usage: URLS.SUBMIT_ENQUIRY_SHARED('some-token')
    SUBMIT_ENQUIRY_SHARED: (token) => `${BASE_URL}/api/forms/submit/shared/${token}/`,

    // ---- Dashboard Management (Authenticated) ----
    DASHBOARD_SUBMISSIONS: `${BASE_URL}/api/dashboard/submissions/`,
    // Usage: URLS.UPDATE_SUBMISSION(123)
    UPDATE_SUBMISSION: (formId) => `${BASE_URL}/api/dashboard/submissions/${formId}/`,
    REORDER_SUBMISSIONS: `${BASE_URL}/api/dashboard/submissions/reorder/`,
};