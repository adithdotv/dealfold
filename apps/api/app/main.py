from fastapi import FastAPI

from app.routes import products

app = FastAPI(title="PriceWise API")
app.include_router(products.router)


@app.get("/api/health")
def health():
    return {"status": "ok"}