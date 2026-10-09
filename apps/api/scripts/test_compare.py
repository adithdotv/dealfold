import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from app.services.comparison_service import compare

for path in sorted((ROOT / "fixtures").glob("product-*.json")):
    query = path.stem.removeprefix("product-").replace("-", " ")
    result = compare(json.loads(path.read_text(encoding="utf-8")), query)
    best = result["best"]
    print(f"\n{path.name}  match={result['match']}  variants={result['selected_variants']}")
    if best:
        print(f"  BEST: {best['store']} {best['final_price']}")
        for reason in best["reasons"]:
            print(f"    - {reason}")
    for offer in result["offers"]:
        print(f"  {offer['store']}: {offer['final_price']} {offer['flags']}")