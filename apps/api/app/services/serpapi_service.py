import serpapi

from app.config import settings

client = serpapi.Client(api_key=settings.serpapi_api_key)


def search_products(query: str) -> dict:
    return client.search({
        "engine": "google_shopping",
        "q": query,
        "gl": settings.serpapi_gl,
        "hl": settings.serpapi_hl,
        "location": settings.serpapi_location,
    }).as_dict()


def get_product(page_token: str) -> dict:
    return client.search({
        "engine": "google_immersive_product",
        "page_token": page_token,
        "more_stores": True,
    }).as_dict()