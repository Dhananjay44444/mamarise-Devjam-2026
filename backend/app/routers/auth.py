from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..schemas import UserCreate, UserOut
from ..models import User

router = APIRouter(prefix="/auth", tags=["Authentication & Profile"])

@router.post("/login", response_model=UserOut)
def login_or_register(user_in: UserCreate, db: Session = Depends(get_db)):
    """Logs in or registers a MamaRise user."""
    user = db.query(User).filter(User.email == user_in.email).first()
    if not user:
        user = User(
            email=user_in.email,
            name=user_in.name,
            role=user_in.role
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    return user

@router.get("/profile/{email}", response_model=UserOut)
def get_user_profile(email: str, db: Session = Depends(get_db)):
    """Retrieves user profile by email."""
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
