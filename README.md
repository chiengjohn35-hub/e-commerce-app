# 🛍️ E‑Store — Modern Full‑Stack E‑Commerce Application

# 🛍️ E‑Store — Modern Full‑Stack E‑Commerce Application

![React](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react&logoColor=white)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?logo=fastapi&logoColor=white)
![Stripe](https://img.shields.io/badge/Payments-Stripe-635BFF?logo=stripe&logoColor=white)
![Docker](https://img.shields.io/badge/Container-Docker-2496ED?logo=docker&logoColor=white)
![Render](https://img.shields.io/badge/Hosting-Render-46E3B7?logo=render&logoColor=white)
![Vercel](https://img.shields.io/badge/Frontend%20Hosting-Vercel-000000?logo=vercel&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)


A clean, production‑ready e‑commerce web application built with **React**, **FastAPI**, **Stripe**, **Docker**, **Render**, and **Vercel**.  
This project demonstrates real‑world full‑stack engineering: authentication, cart logic, orders, payments, and a fully containerized backend.

---

## 🚀 Live Demo

- **Frontend (Vercel):** [e-commerce-store-wine-one.vercel.app](https://e-commerce-store-wine-one.vercel.app)

---

## 🧱 Tech Stack

### **Frontend**
- **Framework:** React + Vite
- **Routing:** React Router (SPA)
- **Styling:** Bootstrap 5
- **UI Feedback:** React Hot Toast

### **Backend**
- **Framework:** FastAPI
- **Database:** SQLAlchemy + SQLite/PostgreSQL
- **Security:** JWT Authentication & Pydantic v2
- **Payments:** Stripe Checkout API

### **DevOps**
- **Containerization:** Docker & Docker Compose
- **Hosting:** Render (Backend) & Vercel (Frontend)
- **CI/CD:** Automated GitHub deployments

---

## 📦 Features

- **🛒 Storefront:** Product listing, detailed views, and local storage cart persistence.
- **👤 Authentication:** Secure Register/Login flow using JWT sessions.
- **💳 Payments:** Integrated Stripe Checkout with automated redirection.
- **📦 Orders:** Real-time order creation and payment status tracking.

---

## 🗂️ Project Structure

### **Backend (`app/`)**
```text
app/
├── routes/
│   ├── auth.py, cart.py, orders.py
│   ├── payment.py, products.py
├── static/images/
├── main.py        # Entry Point
├── models.py      # Database Models
├── schemas.py     # Pydantic Schemas
└── crud.py       # DB Operations
frontend/
├── src/
│   ├── components/  # Navbar, Products
│   ├── pages/       # Login, Cart, SuccessPage, CancelPage
│   ├── api.js       # Axios Configuration
│   └── App.jsx      # Router & Routes
└── vercel.json      # SPA Routing Fix for 404s

```

---

# ☁️ Deployment

### Backend (Render)
- Uses Dockerfile + render.yaml  
- Add environment variables in Render dashboard  
- Auto‑deploys on GitHub push  

### Frontend (Vercel)
- Connect GitHub repo  
- Auto‑deploy on push  
- Set `VITE_API_URL` to your backend URL  

---

# 🧪 API Documentation

FastAPI automatically generates:




---

# 🙌 Author

Built by **Chieng John** — Backend & AI Engineer  
Focused on clean architecture, secure deployments.


