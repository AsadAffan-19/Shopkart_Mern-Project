# ShopKart

ShopKart is a full-stack shopping application. The frontend is a React single-page app, and the backend provides a REST API for customer accounts, product browsing, wishlists, carts, and orders.

## Features

- Customer registration, login, logout, and password changes
- Product catalog and product detail pages
- Authenticated wishlists and shopping carts
- Checkout, Razorpay payment order creation and verification, and order history
- Cookie-based authentication, with bearer tokens also supported by the API
- Sample products seeded automatically when the database is empty

## Project structure

```text
backend/   Express API, MongoDB models, routes, and controllers
frontend/  React application built with Vite
```

## Technology

- **Frontend:** React, React Router, Axios, Vite, Tailwind CSS
- **Backend:** Node.js, Express, Mongoose, MongoDB, JWT, bcrypt, Razorpay

## Run locally

Use a recent Node.js installation. Start the backend and frontend in separate terminals:

```bash
# Terminal 1: backend
cd backend
npm install
npm run dev
```

```bash
# Terminal 2: frontend
cd frontend
npm install
npm run dev
```

The API listens on `http://localhost:8080` by default, and Vite serves the frontend at `http://localhost:5173`.

The backend reads configuration from `backend/.env`. The app can use MongoDB for persistent data and includes an in-memory MongoDB fallback for local development.

| Variable | Purpose |
| --- | --- |
| `PORT` | Backend port (defaults to `8080`) |
| `dbURL` | MongoDB connection URL |
| `JWT_SECRET` | Secret used to sign and verify authentication tokens |
| `FRONTEND_URL` | Additional frontend origin allowed by the API |
| `RAZORPAY_KEY_ID` | Razorpay key ID |
| `RAZORPAY_KEY_SECRET` | Razorpay key secret |

Keep credentials in your local environment file; do not commit secrets.

## Backend API

The API is mounted at the root URL:

| Prefix | Purpose |
| --- | --- |
| `/customers` | Registration, login, current customer, logout, and password changes |
| `/products` | Product listing, creation, and product details |
| `/wishlist` | View and update the signed-in customer's wishlist |
| `/cart` | View and manage the signed-in customer's cart |
| `/orders` | Create and verify payment, and view orders |
| `/health` | API health check |

Wishlist, cart, and order routes require authentication. Customer registration and login are public; retrieving or changing the current customer's account requires authentication. Product routes are public.

## Deploy the frontend to GitHub Pages

The GitHub Actions workflow builds and publishes the frontend whenever changes are pushed to `main`. In the repository settings, open **Settings → Pages** and select **GitHub Actions** as the build and deployment source. After the workflow completes, the site will be available at:

`https://AsadAffan-19.github.io/Shopkart_Mern-Project/`

GitHub Pages only hosts static frontend files; it does not run the Express backend or MongoDB. To enable login and other API features:

1. Host the backend and a MongoDB database (for example, with Render and MongoDB Atlas). Configure the backend service to use `backend` as its root directory, `npm install` as its build command, and `npm start` as its start command.
2. Set `NODE_ENV=production`, `dbURL`, `JWT_SECRET`, and `FRONTEND_URL=https://AsadAffan-19.github.io` in the backend service's environment settings. `JWT_SECRET` should be a private random value; never commit it.
3. In GitHub, open **Settings → Secrets and variables → Actions → Variables**, create a repository variable named `VITE_API_URL`, and set its value to the deployed backend's base URL (for example, `https://your-service.onrender.com`, with no trailing slash).
4. Push a commit or manually rerun the **Deploy frontend to GitHub Pages** workflow so it rebuilds the frontend with the API URL.

## Frontend

The frontend provides login and registration, a home page, product browsing and details, wishlist and cart pages, checkout, payment confirmation, and order history. React context providers manage authentication, cart, and wishlist state; protected routes restrict account-specific pages to signed-in customers.

For local development the API client defaults to `http://localhost:8080`; production builds use the `VITE_API_URL` GitHub Actions variable.
# Shopkart_Mern-Project
