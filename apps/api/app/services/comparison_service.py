from statistics import median

from app.services import serpapi_service
from app.services.offer_service import (
    norm,
    normalize_store,
    returns_allowed,
    returns_blocked,
    selected_variants,
)

LOW_OUTLIER = 0.7
HIGH_OUTLIER = 1.35
BLOCKING_FLAGS = {"availability_unconfirmed", "variant_mismatch", "unusually_low", "conditional_price"}


def inr(value: float) -> str:
    whole = str(round(value))
    if len(whole) <= 3:
        return f"₹{whole}"
    head, tail = whole[:-3], whole[-3:]
    groups = []
    while len(head) > 2:
        groups.insert(0, head[-2:])
        head = head[:-2]
    groups.insert(0, head)
    return f"₹{','.join(groups)},{tail}"


def _eligible(offer: dict) -> bool:
    return bool(offer["final_price"]) and not BLOCKING_FLAGS & set(offer["flags"])


def _rank(offer: dict) -> tuple:
    return (
        offer["final_price"],
        1 if returns_blocked(offer) else 0,
        1 if "variant_unconfirmed" in offer["flags"] else 0,
    )


def _mark_outliers(offers: list[dict], mid: float) -> None:
    for offer in offers:
        if not offer["final_price"]:
            continue
        if offer["final_price"] < mid * LOW_OUTLIER:
            offer["flags"].append("unusually_low")
        elif offer["final_price"] > mid * HIGH_OUTLIER:
            offer["flags"].append("unusually_high")


def _query_match(query: str, offers: list[dict]) -> dict:
    tokens = [norm(t) for t in query.split() if any(c.isdigit() for c in t)]
    titles = [norm(o["title"] or "") for o in offers]
    missing = [t for t in tokens if titles and sum(t in title for title in titles) < len(titles) / 2]
    return {"status": "similar" if missing else "exact", "missing_terms": missing}


def _reasons(best: dict, tied: list[dict], eligible: list[dict], mid: float, variants: list) -> list[str]:
    reasons = []
    higher = [o["final_price"] for o in eligible if o["final_price"] > best["final_price"]]
    if higher:
        reasons.append(f"{inr(min(higher) - best['final_price'])} less than the next cheapest store")
    if mid > best["final_price"]:
        reasons.append(f"{inr(mid - best['final_price'])} below the median price across stores")
    reasons.append("Free delivery" if not best["delivery_fee"] else f"Includes {inr(best['delivery_fee'])} delivery")
    reasons.append("In stock online")
    if variants and "variant_unconfirmed" not in best["flags"]:
        reasons.append("Listing confirms " + ", ".join(s for s, _ in variants))
    if returns_allowed(best):
        reasons.append(best["returns_text"])
    if tied:
        reasons.append("Same final price at " + ", ".join(t["store"] for t in tied))
    return reasons


def compare(data: dict, query: str = "") -> dict:
    product = data.get("product_results", {})
    variants = selected_variants(product, query)
    offers = [normalize_store(s, variants) for s in product.get("stores", [])]
    prices = [o["final_price"] for o in offers if o["final_price"]]
    mid = median(prices) if prices else 0
    _mark_outliers(offers, mid)

    eligible = sorted(filter(_eligible, offers), key=_rank)
    best = eligible[0] if eligible else None
    tied = [o for o in eligible[1:] if o["final_price"] == best["final_price"]] if best else []
    for offer in offers:
        offer["is_best"] = offer is best

    return {
        "product": {
            "title": product.get("title"),
            "brand": product.get("brand"),
            "rating": product.get("rating"),
            "reviews": product.get("reviews"),
            "thumbnail": (product.get("thumbnails") or [None])[0],
            "price_range": product.get("price_range"),
            "variants": product.get("variants", []),
            "features": product.get("about_the_product", {}).get("features", []),
        },
        "match": _query_match(query, offers),
        "selected_variants": [s for s, _ in variants],
        "best": {
            **best,
            "reasons": _reasons(best, tied, eligible, mid, variants),
            "tied_with": [t["store"] for t in tied],
        } if best else None,
        "offers": sorted(offers, key=lambda o: (not _eligible(o), o["final_price"] or 0)),
        "stats": {
            "store_count": len(offers),
            "eligible_count": len(eligible),
            "lowest": eligible[0]["final_price"] if eligible else None,
            "median": mid,
            "highest": max(prices) if prices else None,
        },
    }


def build_comparison(page_token: str, query: str = "") -> dict:
    return compare(serpapi_service.get_product(page_token), query)