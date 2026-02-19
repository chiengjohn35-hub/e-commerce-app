from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import crud, schemas
from ..db import get_db

router = APIRouter()


@router.get("/{order_id}", response_model=schemas.Order)
def get_order(order_id: int, db: Session = Depends(get_db)):
    """Return order details including line items and paid status."""
    o = crud.get_order(db, order_id)
    if not o:
        raise HTTPException(status_code=404, detail="Order not found")
    return o
