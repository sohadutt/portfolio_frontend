# Portfolio Frontend

A React + Vite frontend for a portfolio platform with:

- public portfolio rendering
- authenticated dashboard management
- portfolio routing by share token and portfolio index
- enquiry submission review
- profile and theme controls

This repository is paired with a Django backend. The `backend_scripts/` folder in this project is a backend reference snapshot used to align the frontend with the expected API contract.

## Tech Stack

- React 19
- Vite 8
- React Router
- Tailwind CSS
- shadcn-style UI components
- Axios
- Lucide React
- Sonner

## Project Structure

```text
src/
  components/
    dashboard/      dashboard pages and management tools
    portfolio/      public portfolio sections
    ui/             reusable UI primitives
    user/           auth and profile components
  helper/           API helpers, static fallback content, URL config
  hooks/            theme and device hooks
  style/            global styles

backend_scripts/
  models.py
  serializers.py
  urls.py
  views.py
```

## Frontend Routes

### Public

- `/` - default public portfolio, index `1`
- `/preview/:index` - default public portfolio by portfolio index
- `/portfolio/:token` - shared public portfolio, index `1`
- `/portfolio/:token/:index` - shared public portfolio by portfolio index
- `/login` - authentication page

### Dashboard

- `/dashboard` - overview page
- `/dashboard/portfolios` - portfolio manager
- `/dashboard/portfolios/:index/edit` - portfolio editor
- `/dashboard/submissions` - enquiry/submission management
- `/dashboard/icons` - Lucide icon browser for content editing

## Backend Contract Used

The frontend is currently aligned to these backend endpoints from `backend_scripts/urls.py`:

### Auth and profile

- `GET /api/csrf/`
- `POST /api/auth/register/`
- `POST /api/auth/login/`
- `POST /api/auth/otp/request/`
- `POST /api/auth/otp/verify/`
- `POST /api/auth/refresh/`
- `POST /api/auth/logout/`
- `GET /api/profile/`
- `PATCH /api/profile/update/`
- `PATCH /api/profile/share-toggle/`

### Portfolio

- `GET /api/portfolio/default/`
- `GET /api/portfolio/default/:index/`
- `GET /api/portfolio/shared/:token/`
- `GET /api/portfolio/shared/:token/:index/`
- `POST /api/portfolio/submit/:index/`
- `PATCH /api/portfolio/update/:index/`

### Dashboard

- `GET /api/dashboard/portfolios/all/`
- `PATCH /api/dashboard/portfolios/:index/toggle/`
- `GET /api/dashboard/submissions/view/`
- `PATCH /api/dashboard/submissions/update/:id/`
- `POST /api/dashboard/submissions/reorder/`

### Public contact form

- `POST /api/forms/submit/default/:index/`
- `POST /api/forms/submit/shared/:token/`

## What Was Integrated

- Replaced the previous single-route app shell with a route-based public and dashboard structure.
- Connected the portfolio sections to backend-driven data instead of relying only on static local content.
- Added a dashboard shell with authenticated navigation and routed manager/editor/submission views.
- Added a working submissions page for reviewing and updating enquiries.
- Fixed helper/API issues including missing `fetchPublicPortfolio` support and better surfaced request errors.
- Fixed auth page imports that would have broken the login/signup screen.
- Added a lightweight icon browser route for content editing support.

## Local Development

### 1. Install dependencies

```bash
npm install
```

### 2. Start the frontend

```bash
npm run dev
```

By default the frontend expects the backend API at:

```text
http://localhost:8000
```

You can change this in [`src/helper/urls.js`](/Users/ssohadutt/developement/portfolio_frontend/src/helper/urls.js).

### 3. Quality checks

```bash
npm run lint
npm run build
```

## Important Current Limitations

These are not frontend bugs only; some are missing platform pieces that still need to be added:

1. There is no authenticated `GET` endpoint for loading a specific owner's portfolio into the editor.
The editor can save through `PATCH /api/portfolio/update/:index/`, but a proper owner-scoped read endpoint is still needed for a complete edit flow.

2. OTP verification UI is still incomplete.
The backend supports OTP request and verification, but the frontend still needs a dedicated verification screen and post-signup flow.

3. Shared contact submission only supports the primary shared route in the current backend snapshot.
If you want shared portfolio contact forms for multiple portfolio indexes, the backend should expose `shared/:token/:index` submit support as well.

4. The production bundle is large.
The build passes, but Vite reports a large chunk size warning. Route-level code splitting would be a good next improvement.

## Suggested Next Steps

### Backend

- Add `GET /api/portfolio/manage/:index/` or equivalent authenticated endpoint for editor preload.
- Add authenticated create/list endpoints if portfolio creation will grow beyond simple index-based editing.
- Return complete editor-safe portfolio payloads for all arrays consistently.
- Add shared form submission for indexed shared portfolios if multi-portfolio public sharing is required.

### Frontend

- Build OTP verification and resend flow.
- Add route guards based on verification state and tier limits.
- Add create-portfolio onboarding instead of sending users directly to the next index editor.
- Add optimistic reorder UI for submissions if you want to use the reorder endpoint fully.
- Move API base URL to environment variables.
- Add route-level lazy loading to reduce initial bundle size.

## Notes

- `backend_scripts/` is treated here as a backend reference, not as a runnable backend inside this frontend project.
- Static content in [`src/helper/portfolio.js`](/Users/ssohadutt/developement/portfolio_frontend/src/helper/portfolio.js) still acts as fallback content where backend data is unavailable.
