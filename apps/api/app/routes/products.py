from fastapi import APIRouter

from app.services import serpapi_service, comparison_service

router = APIRouter(prefix="/api")


@router.get("/search")
def search(q: str):
    return serpapi_service.search_products(q)


@router.get("/product")
def product(token: str, q: str = ""):
    return comparison_service.build_comparison(token, q)