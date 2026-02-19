from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import crud, schemas
from ..db import get_db

router = APIRouter()


@router.post("/", response_model=schemas.Cart)
def create_cart(db: Session = Depends(get_db)):
    """Create a new cart. Returns the created `Cart` with its id."""
    return crud.create_cart(db)


@router.get("/{cart_id}", response_model=schemas.Cart)
def get_cart(cart_id: int, db: Session = Depends(get_db)):
    """Retrieve a cart and its items by id."""
    c = crud.get_cart(db, cart_id)
    if not c:
        raise HTTPException(status_code=404, detail="Cart not found")
    return c


@router.post("/{cart_id}/items", response_model=schemas.CartItem)
def add_item(cart_id: int, payload: schemas.CartItemCreate, db: Session = Depends(get_db)):
    """Add an item to the cart. If the item exists, increases quantity."""
    c = crud.get_cart(db, cart_id)
    if not c:
        raise HTTPException(status_code=404, detail="Cart not found")
    p = crud.get_product(db, payload.product_id)
    if not p:
        raise HTTPException(status_code=404, detail="Product not found")
    return crud.add_item_to_cart(db, c, p, payload.quantity)


@router.delete("/{cart_id}/items/{item_id}", response_model=schemas.CartItem)
def remove_item(cart_id: int, item_id: int, db: Session = Depends(get_db)):
    """Remove an item from the cart by item id."""
    c = crud.get_cart(db, cart_id)
    if not c:
        raise HTTPException(status_code=404, detail="Cart not found")
    item = crud.remove_item_from_cart(db, c, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item


@router.post("/{cart_id}/checkout", response_model=schemas.Order)
def checkout(cart_id: int, db: Session = Depends(get_db)):
    """Convert the cart into an order. Returns the created `Order`."""
    c = crud.get_cart(db, cart_id)
    if not c:
        raise HTTPException(status_code=404, detail="Cart not found")
    try:
        order = crud.create_order_from_cart(db, c)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    return order
