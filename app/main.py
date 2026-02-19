from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .db import init_db
from .routers import products, cart, orders, payments, auth

# Core FastAPI application instance
app = FastAPI(title="E-Commerce API")

# CORS configuration to allow development frontend (Vite) to access the API.
# Adjust origins as needed for production (or restrict to specific hostnames).
origins = [
    "http://localhost",
    "http://localhost:5173",
    "http://127.0.0.1",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount routers for modular endpoints
app.include_router(products.router, prefix="/products", tags=["products"])
app.include_router(cart.router, prefix="/carts", tags=["carts"])
app.include_router(orders.router, prefix="/orders", tags=["orders"])
app.include_router(payments.router, prefix="/payments", tags=["payments"])
app.include_router(auth.router, prefix="/auth", tags=["auth"])


@app.on_event("startup")
def on_startup():
    # Initialize DB schema in development. In production use Alembic migrations.
    init_db()


@app.get("/")
def read_root():
    # Simple root endpoint useful for quick health checks.
    return {"message": "E-Commerce API (FastAPI)"}
