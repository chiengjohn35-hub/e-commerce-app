from fastapi import APIRouter, Depends, HTTPException,  Request 
from sqlalchemy.orm import Session
from .. import crud, schemas
from ..db import get_db
import stripe
from dotenv import load_dotenv
import os


load_dotenv()  # Load environment variables from .env file

# Replace with your actual Stripe Secret Key from dashboard.stripe.com
stripe.api_key = os.getenv("STRIPE_SECRET_KEY" )
# You'll get this after setting up a webhook in Stripe Dashboard/CLI
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET", ) 


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




@router.post("/create-checkout-session/", response_model=schemas.StripeSessionResponse)
async def create_checkout_session(payload: schemas.OrderReference, db: Session = Depends(get_db)):
    order = crud.get_order(db, payload.order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    try:
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': 'usd',
                    'product_data': {'name': f"Order #{order.id}"},
                    'unit_amount': int(order.total_amount * 100), # Stripe uses cents
                },
                'quantity': 1,
            }],
            mode='payment',
            success_url="https://e-commerce-store-wine-one.vercel.app/success?session_id={CHECKOUT_SESSION_ID}",
            cancel_url="https://e-commerce-store-wine-one.vercel.app/cancel",

            # VERY IMPORTANT: This links the Stripe payment to your DB order
            metadata={"order_id": str(order.id)} 
        )
        return {"checkout_url": session.url}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/webhook")
async def stripe_webhook(request: Request, db: Session = Depends(get_db)):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, STRIPE_WEBHOOK_SECRET)
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid Webhook Signature")

    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        order_id = int(session['metadata']['order_id'])
        amount = session['amount_total'] / 100
        
        # Mark order as paid using your existing CRUD logic
        order = crud.get_order(db, order_id)
        if order:
            crud.create_payment(db, order, amount, provider="stripe")
            
    return {"status": "success"}
