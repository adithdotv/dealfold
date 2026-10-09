from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routes import products

app = FastAPI(title="PriceWise API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origin_list,
    allow_methods=["GET"],
)
app.include_router(products.router)


@app.get("/api/health")
def health():
    return {"status": "ok"}
