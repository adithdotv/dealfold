from fastapi import APIRouter

from app.services import serpapi_service

router = APIRouter(prefix="/api")


@router.get("/search")
def search(q: str):
    return serpapi_service.search_products(q)


@router.get("/product")
def product(token: str):
    return serpapi_service.get_product(token)