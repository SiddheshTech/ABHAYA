import jwt
from fastapi import HTTPException, Security, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Dict, Any

security = HTTPBearer()

# In a real scenario, these would come from Keycloak or environment variables
SECRET_KEY = "rakshak-super-secret-key"
ALGORITHM = "HS256"

def verify_jwt(credentials: HTTPAuthorizationCredentials = Security(security)) -> Dict[str, Any]:
    """
    Verifies the JWT token and extracts the payload.
    In production, this would validate against Keycloak's public keys.
    """
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Signature has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

def get_current_user(payload: dict = Depends(verify_jwt)) -> dict:
    """
    Extracts the user info from the payload. 
    Can be used as a dependency in FastAPI routes.
    """
    user_id = payload.get("sub")
    if user_id is None:
        raise HTTPException(status_code=401, detail="Invalid user ID in token")
    return {"user_id": user_id, "roles": payload.get("roles", [])}

def require_role(required_role: str):
    """
    Dependency factory to check if the user has a specific role.
    """
    def role_checker(user: dict = Depends(get_current_user)):
        if required_role not in user.get("roles", []):
            raise HTTPException(status_code=403, detail="Insufficient permissions")
        return user
    return role_checker
