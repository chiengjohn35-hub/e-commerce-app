from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from .db import get_db
from . import crud
from .security import decode_token

# OAuth2 scheme that reads the ``Authorization: Bearer <token>`` header
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")

credentials_exception = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Could not validate credentials",
    headers={"WWW-Authenticate": "Bearer"},
)


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """Dependency to retrieve the currently authenticated user from a JWT.

    Raises a 401 HTTPException if the token is invalid or the user does not exist.
    Use in routes as `user: User = Depends(get_current_user)` to protect endpoints.
    """
    try:
        payload = decode_token(token)
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except Exception:
        raise credentials_exception
    user = crud.get_user_by_email(db, email)
    if not user:
        raise credentials_exception
    return user
