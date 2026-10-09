import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

for path in sorted((ROOT / "fixtures").glob("product-*.json")):
    product = json.loads(path.read_text(encoding="utf-8")).get("product_results", {})
    print(f"\n{path.name}")
    for group in product.get("variants", []):
        items = [(i["name"], "SELECTED" if i.get("selected") else "") for i in group.get("items", [])]
        print(f"  {group.get('title')}: {items}")
    for store in product.get("stores", []):
        print(f"    {store.get('name')} | {store.get('extracted_total')} | {store.get('title')}")