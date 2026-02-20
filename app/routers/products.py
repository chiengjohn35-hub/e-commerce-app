from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
import os
import uuid
from fastapi import UploadFile, File, Form
from fastapi.staticfiles import StaticFiles


from .. import crud, schemas
from ..db import get_db

router = APIRouter()




BASE_DIR = os.path.dirname(os.path.abspath(__file__))  # app/routers/
APP_DIR = os.path.dirname(BASE_DIR)                    # app/
STATIC_DIR = os.path.join(APP_DIR, "static")
UPLOAD_DIR = os.path.join(STATIC_DIR, "uploads")

os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/upload", response_model=schemas.Product)
async def create_product_with_image(
    name: str = Form(...),
    price: float = Form(...),
    image: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    # 1. Handle File Saving
    ext = image.filename.split(".")[-1]
    filename = f"{uuid.uuid4()}.{ext}"
    file_path = os.path.join(UPLOAD_DIR, filename)

    with open(file_path, "wb") as f:
        f.write(await image.read())

    image_url = f"/static/uploads/{filename}"

    # 2. Prepare the Schema
    product_data = schemas.ProductCreate(
        name=name, 
        price=price, 
        image_url=image_url
    )

    # 3. Use CRUD to Save and Return
    return crud.create_product(db, product_data)

@router.get("/", response_model=schemas.PaginatedProducts)
def list_products(q: Optional[str] = Query(None), page: int = 1, per_page: int = 20, db: Session = Depends(get_db)):
    if page < 1: page = 1
    if per_page < 1: per_page = 20
    skip = (page - 1) * per_page

    # Updated: Filter by name only since description is removed
    query = db.query(crud.models.Product)
    if q:
        query = query.filter(crud.models.Product.name.ilike(f"%{q}%"))
    
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
