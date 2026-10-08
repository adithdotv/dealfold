import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.services import serpapi_service

QUERIES = ["sony wh-1000xm5", "iphone 17 256gb", "macbook air m4"]
OUT = Path(__file__).resolve().parents[1] / "fixtures"

for query in QUERIES:
    slug = query.replace(" ", "-")
    search = serpapi_service.search_products(query)
    (OUT / f"search-{slug}.json").write_text(json.dumps(search, indent=2))

    first = next(
        (r for r in search.get("shopping_results", []) if r.get("multiple_sources")),
        None,
    )
    if not first:
        print(f"{query}: no multi-store product found")
        continue

    product = serpapi_service.get_product(first["immersive_product_page_token"])
    (OUT / f"product-{slug}.json").write_text(json.dumps(product, indent=2))

    stores = product.get("product_results", {}).get("stores", [])
    print(f"\n{query}: {first['title']}")
    for s in stores:
        print(f"  {s.get('name')}: {s.get('price')} | total {s.get('total')} | {s.get('details_and_offers')}")