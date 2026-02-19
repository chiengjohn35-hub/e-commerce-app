from typing import List, Optional
from pydantic import BaseModel


class ProductBase(BaseModel):
    name: str
    description: Optional[str] = ""
    price: float
    stock: int = 0


class ProductCreate(ProductBase):
    pass


class Product(ProductBase):
    id: int
    model_config = {"from_attributes": True}


class PaginatedProducts(BaseModel):
    items: List[Product]
    total: int
    page: int
    per_page: int

    class Config:
        orm_mode = True


class CartItemCreate(BaseModel):
    product_id: int
    quantity: int = 1


class CartItem(BaseModel):
    id: int
    product: Product
    quantity: int
    model_config = {"from_attributes": True}


class Cart(BaseModel):
    id: int
    items: List[CartItem] = []
    model_config = {"from_attributes": True}


class OrderCreate(BaseModel):
    cart_id: int


class OrderItem(BaseModel):
    id: int
    product: Product
    quantity: int
    unit_price: float
    model_config = {"from_attributes": True}


class Order(BaseModel):
    id: int
    total_amount: float
    paid: bool
    items: List[OrderItem] = []
    model_config = {"from_attributes": True}


class PaymentCreate(BaseModel):
    order_id: int
    amount: float
    provider: Optional[str] = "local"


class Payment(BaseModel):
    id: int
    order_id: int
    amount: float
    status: str
    model_config = {"from_attributes": True}


class UserBase(BaseModel):
    email: str


class UserCreate(UserBase):
    password: str


class User(UserBase):
    id: int
    is_active: bool
    model_config = {"from_attributes": True}


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None


class PaginatedProducts(BaseModel):
    items: List[Product]
    total: int
    page: int
    per_page: int

    model_config = {"from_attributes": True}
