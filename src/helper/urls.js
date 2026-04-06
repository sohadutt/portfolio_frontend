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
    // Use for primary: URLS.PORTFOLIO_DEFAULT() 
    // Use for indexed: URLS.PORTFOLIO_DEFAULT(2)
    PORTFOLIO_DEFAULT: (idx = 1) => idx === 1 
        ? `${BASE_URL}/api/portfolio/default/` 
        : `${BASE_URL}/api/portfolio/default/${idx}/`,

    // Use for primary: URLS.PORTFOLIO_SHARED('my-token')
    // Use for indexed: URLS.PORTFOLIO_SHARED('my-token', 2)
    PORTFOLIO_SHARED: (token, idx = 1) => idx === 1 
        ? `${BASE_URL}/api/portfolio/shared/${token}/` 
        : `${BASE_URL}/api/portfolio/shared/${token}/${idx}/`,

    // ---- Portfolio Management (Authenticated) ----
    // Backend now strictly requires the index in the URL
    PORTFOLIO_SUBMIT: (idx = 1) => `${BASE_URL}/api/portfolio/submit/${idx}/`,
    PORTFOLIO_UPDATE: (idx = 1) => `${BASE_URL}/api/portfolio/update/${idx}/`,

    // ---- Contact Form Submissions (Public) ----
    SUBMIT_FORM_DEFAULT: (idx = 1) => `${BASE_URL}/api/forms/submit/default/${idx}/`,
    // Backend strictly takes the token and applies order_index=1 via kwargs
    SUBMIT_ENQUIRY_SHARED: (token) => `${BASE_URL}/api/forms/submit/shared/${token}/`,

    // ---- Dashboard Management (Authenticated) ----
    // Submissions
    DASHBOARD_SUBMISSIONS: `${BASE_URL}/api/dashboard/submissions/view/`,
    UPDATE_SUBMISSION: (formId) => `${BASE_URL}/api/dashboard/submissions/update/${formId}/`,
    REORDER_SUBMISSIONS: `${BASE_URL}/api/dashboard/submissions/reorder/`,

    // Portfolios
    DASHBOARD_PORTFOLIOS: `${BASE_URL}/api/dashboard/portfolios/`,
    TOGGLE_PORTFOLIO: (idx) => `${BASE_URL}/api/dashboard/portfolios/${idx}/toggle/`,
};