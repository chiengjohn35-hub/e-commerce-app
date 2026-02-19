from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from .. import crud, schemas
from ..db import get_db

router = APIRouter()


@router.post("/", response_model=schemas.Product)
def create_product(payload: schemas.ProductCreate, db: Session = Depends(get_db)):
    """Create a new product (admin/demo use).

    Accepts a `ProductCreate` payload and returns the created `Product`.
    """
    return crud.create_product(db, payload)


@router.get("/", response_model=schemas.PaginatedProducts)
def list_products(q: Optional[str] = Query(None, description="search query"), page: int = 1, per_page: int = 20, db: Session = Depends(get_db)):
    """List products with optional search and pagination.

    Query parameters:
    - `q`: text search over name and description
    - `page`, `per_page`: pagination controls (1-based page)
    Returns a `PaginatedProducts` object with items and metadata.
    """
    if page < 1:
        page = 1
    if per_page < 1:
        per_page = 20
    skip = (page - 1) * per_page

    # Build search query if q provided using case-insensitive LIKE
    query = db.query(crud.models.Product) if not q else db.query(crud.models.Product).filter(crud.models.Product.name.ilike(f"%{q}%") | crud.models.Product.description.ilike(f"%{q}%"))
    total = query.count()
    items = query.offset(skip).limit(per_page).all()

    return schemas.PaginatedProducts(items=items, total=total, page=page, per_page=per_page)


@router.get("/{product_id}", response_model=schemas.Product)
def get_product(product_id: int, db: Session = Depends(get_db)):
    """Fetch a single product by id."""
    p = crud.get_product(db, product_id)
    if not p:
        raise HTTPException(status_code=404, detail="Product not found")
    return p
