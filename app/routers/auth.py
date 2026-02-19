from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from .. import crud, schemas
from ..db import get_db
from ..security import verify_password, create_access_token

router = APIRouter()


@router.post("/register", response_model=schemas.User)
def register(user_in: schemas.UserCreate, db: Session = Depends(get_db)):
    """Register a new user. Returns the created user (without password)."""
    existing = crud.get_user_by_email(db, user_in.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    user = crud.create_user(db, user_in)
    return user


@router.post("/token", response_model=schemas.Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """Obtain a JWT access token using OAuth2 password flow."""
    user = crud.get_user_by_email(db, form_data.username)
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    access_token_expires = timedelta(minutes=60 * 24)
    token = create_access_token({"sub": user.email}, expires_delta=access_token_expires)
    return {"access_token": token, "token_type": "bearer"}



@router.post("/forgot-password")
def forgot_password(payload: dict, db: Session = Depends(get_db)):
    """Create a password reset token and return it (demo behavior).

    Production should send the token via email and not return it in the API.
    """
    # payload should contain {"email": "..."}
    email = payload.get("email")
    if not email:
        raise HTTPException(status_code=400, detail="email required")
    pr = crud.create_password_reset(db, email)
    if not pr:
        # don't reveal whether email exists
        return {"message": "If that email exists, you'll receive reset instructions (demo returns token)."}
    # In production we would email the token. For demo, return it.
    return {"message": "reset token (demo)", "token": pr.token}


@router.post("/reset-password")
def reset_password(payload: dict, db: Session = Depends(get_db)):
    """Consume a reset token and set a new password for the user."""
    token = payload.get("token")
    new_password = payload.get("new_password")
    if not token or not new_password:
        raise HTTPException(status_code=400, detail="token and new_password required")
    user = crud.use_password_reset(db, token, new_password)
    if not user:
        raise HTTPException(status_code=400, detail="invalid or expired token")
    return {"message": "password reset successful"}
