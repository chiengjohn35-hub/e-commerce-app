from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import crud, schemas
from ..db import get_db

router = APIRouter()


@router.post("/pay", response_model=schemas.Payment)
def pay(payload: schemas.PaymentCreate, db: Session = Depends(get_db)):
    """Process a payment for an order (demo).

    For this demo the payment is recorded as `completed` immediately. In
    production integrate with a payment provider and handle asynchronous
    status updates via webhooks.
    """
    order = crud.get_order(db, payload.order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if order.paid:
        raise HTTPException(status_code=400, detail="Order already paid")
    payment = crud.create_payment(db, order, payload.amount, payload.provider)
    return payment
