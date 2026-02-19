from datetime import datetime, timedelta
from typing import Optional
import secrets

from passlib.context import CryptContext
from jose import jwt, JWTError

# NOTE: For demo purposes we generate a SECRET_KEY at runtime. This means
# tokens will be invalidated on each process restart. In production, set
# a stable secret via environment variable or secure vault.
SECRET_KEY = "" + secrets.token_urlsafe(32)
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24

# Password hashing context using bcrypt
# Password hashing context.
# Use `bcrypt_sha256` instead of raw `bcrypt` so very long passphrases are
# first hashed with SHA-256 before being passed to bcrypt, avoiding the 72
# byte limit error while preserving bcrypt's strengths. This also avoids
# edge-cases where the installed `bcrypt` package may not expose metadata
# attributes passlib expects.
pwd_context = CryptContext(schemes=["bcrypt_sha256"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against a hashed password using passlib."""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Hash a password for storage."""
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create a JWT access token embedding provided `data` and `exp` claim."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def decode_token(token: str) -> dict:
    """Decode and validate a JWT. Raises on invalid/expired token."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError as e:
        # Let the caller handle exceptions and convert to HTTP errors
        raise 
