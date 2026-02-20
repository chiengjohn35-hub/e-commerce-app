from sqlalchemy import Column, Integer, String, Float, ForeignKey, Boolean, DateTime, func
from sqlalchemy.orm import relationship
from .db import Base


class Product(Base):
    """Represents a product available for purchase.

    Fields:
    - `name`, `description`, `price`, `stock`, `created_at`
    """
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    price = Column(Float)  # Fixed: SQLAlchemy uses 'Float' with a capital 'F'
    image_url = Column(String, nullable=True)

class User(Base):
    """Represents a user account.

    Only minimal fields are present for demo purposes. Passwords are stored
    hashed in `hashed_password`.
    """
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    carts = relationship("Cart", back_populates="user")
    orders = relationship("Order", back_populates="user")


class Cart(Base):
    """A shopping cart. Can be anonymous (no `user_id`) or linked to a `User`.

    `items` is a relationship to `CartItem` objects; cascade deletes remove
    items when a cart is deleted.
    """
    __tablename__ = "carts"

    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    items = relationship("CartItem", cascade="all, delete-orphan", back_populates="cart")
    user = relationship("User", back_populates="carts")


class CartItem(Base):
    """An item in a `Cart` linking to a `Product` with a quantity."""
    __tablename__ = "cart_items"

    id = Column(Integer, primary_key=True, index=True)
    cart_id = Column(Integer, ForeignKey("carts.id", ondelete="CASCADE"))
    product_id = Column(Integer, ForeignKey("products.id"))
    quantity = Column(Integer, default=1)

    cart = relationship("Cart", back_populates="items")
    product = relationship("Product")


class Order(Base):
    """Represents a completed order created from a cart's items."""
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    total_amount = Column(Float, nullable=False)
    paid = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    items = relationship("OrderItem", cascade="all, delete-orphan", back_populates="order")
    user = relationship("User", back_populates="orders")


class OrderItem(Base):
    """An item line within an Order."""
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id", ondelete="CASCADE"))
    product_id = Column(Integer, ForeignKey("products.id"))
    quantity = Column(Integer, default=1)
    unit_price = Column(Float, nullable=False)

    order = relationship("Order", back_populates="items")
    product = relationship("Product")


class Payment(Base):
    """Records a payment associated with an `Order`.

    `provider` is a string identifying the payment gateway; `status` tracks
    payment state (e.g. pending, completed).
    """
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    amount = Column(Float, nullable=False)
    provider = Column(String, default="local")
    status = Column(String, default="pending")
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class PasswordReset(Base):
    """Stores password reset tokens for a user (demo implementation)."""
    __tablename__ = "password_resets"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    token = Column(String, unique=True, index=True, nullable=False)
    used = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User")
