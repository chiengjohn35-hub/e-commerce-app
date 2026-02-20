from sqlalchemy.orm import Session
from . import models, schemas
from .security import get_password_hash
import secrets
from datetime import timedelta, datetime

# CRUD helpers encapsulate DB access and business logic so routers remain thin.
# Each function receives a `db: Session` and performs necessary queries/commits.


def create_product(db: Session, product_in: schemas.ProductCreate) -> models.Product:
    # Create and persist a Product from the Pydantic input schema
    p = models.Product(name=product_in.name, price=product_in.price, image_url=product_in.image_url)
    db.add(p)
    db.commit()
    db.refresh(p)
    return p


def list_products(db: Session, skip: int = 0, limit: int = 100):
    # Return a tuple (items, total) to support pagination metadata
    q = db.query(models.Product)
    total = q.count()
    items = q.offset(skip).limit(limit).all()
    return items, total


def get_product(db: Session, product_id: int):
    # Fetch single product by id or return None
    return db.query(models.Product).filter(models.Product.id == product_id).first()


def create_cart(db: Session) -> models.Cart:
    # Create an empty cart. Cart may be linked to a user later.
    c = models.Cart()
    db.add(c)
    db.commit()
    db.refresh(c)
    return c


def get_cart(db: Session, cart_id: int):
    # Retrieve a cart by id
    return db.query(models.Cart).filter(models.Cart.id == cart_id).first()


def add_item_to_cart(db: Session, cart: models.Cart, product: models.Product, quantity: int = 1):
    # Add or update a CartItem for the given cart and product. Commits are
    # performed here to persist changes immediately for this simple demo.
    for item in cart.items:
        if item.product_id == product.id:
            item.quantity += quantity
            db.add(item)
            db.commit()
            db.refresh(item)
            return item
    item = models.CartItem(cart=cart, product=product, quantity=quantity)
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


def remove_item_from_cart(db: Session, cart: models.Cart, item_id: int):
    # Remove a cart item by id if it belongs to the given cart
    item = db.query(models.CartItem).filter(models.CartItem.id == item_id, models.CartItem.cart_id == cart.id).first()
    if item:
        db.delete(item)
        db.commit()
    return item


def create_order_from_cart(db: Session, cart: models.Cart) -> models.Order:
    # Convert a cart into an order. This is a simple synchronous flow that:
    # 1) creates an Order, 2) creates OrderItem rows for each CartItem, and
    # 3) clears cart items. In production you'd want to check stock, validate
    # prices, and possibly run this in a transactional/queued workflow.
    if not cart.items:
        raise ValueError("Cart is empty")
    total = 0.0
    order = models.Order(total_amount=0.0)
    db.add(order)
    db.flush()
    for item in cart.items:
        unit_price = item.product.price
        oi = models.OrderItem(order=order, product_id=item.product_id, quantity=item.quantity, unit_price=unit_price)
        db.add(oi)
        total += unit_price * item.quantity
    order.total_amount = total
    # remove cart items
    db.query(models.CartItem).filter(models.CartItem.cart_id == cart.id).delete()
    db.commit()
    db.refresh(order)
    return order


def get_order(db: Session, order_id: int):
    # Retrieve an order by id
    return db.query(models.Order).filter(models.Order.id == order_id).first()


def create_payment(db: Session, order: models.Order, amount: float, provider: str = "local") -> models.Payment:
    # For demo purposes this records a completed payment and marks the order paid.
    # Replace with real provider integration and webhooks in production.
    p = models.Payment(order_id=order.id, amount=amount, provider=provider, status="completed")
    order.paid = True
    db.add(p)
    db.add(order)
    db.commit()
    db.refresh(p)
    return p


def get_user_by_email(db: Session, email: str):
    # Helper to find a user by email
    return db.query(models.User).filter(models.User.email == email).first()


def create_user(db: Session, user_in: schemas.UserCreate):
    # Create a new user, hashing the provided password before persisting.
    hashed = get_password_hash(user_in.password)
    user = models.User(email=user_in.email, hashed_password=hashed)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def create_password_reset(db: Session, email: str):
    # Create a password reset token and persist it. In a real app this token
    # would be emailed to the user; here we return it for demo/testing.
    user = get_user_by_email(db, email)
    if not user:
        return None
    token = secrets.token_urlsafe(24)
    pr = models.PasswordReset(user_id=user.id, token=token)
    db.add(pr)
    db.commit()
    db.refresh(pr)
    return pr


def verify_password_reset(db: Session, token: str):
    # Validate a reset token (unused). Does not check expiration in this demo.
    pr = db.query(models.PasswordReset).filter(models.PasswordReset.token == token, models.PasswordReset.used == False).first()
    return pr


def use_password_reset(db: Session, token: str, new_password: str):
    # Apply a password reset: mark token used and update user's hashed password.
    pr = verify_password_reset(db, token)
    if not pr:
        return None
    user = db.query(models.User).filter(models.User.id == pr.user_id).first()
    if not user:
        return None
    user.hashed_password = get_password_hash(new_password)
    pr.used = True
    db.add(user)
    db.add(pr)
    db.commit()
    return user
