import re


def norm(text: str) -> str:
    return re.sub(r"[^a-z0-9]", "", text.lower())


def _contains(text: str, value: str) -> bool:
    parts = re.findall(r"[a-z]+|\d+", value.lower())
    if not parts:
        return False
    pattern = r"(?<![a-z0-9])" + r"[^a-z0-9]*".join(map(re.escape, parts)) + r"(?![a-z0-9])"
    return re.search(pattern, text.lower()) is not None


def _find(items: list[str], keyword: str) -> str | None:
    return next((i for i in items if keyword in i.lower()), None)


def selected_variants(product: dict, query: str = "") -> list[tuple[str, list[str]]]:
    groups = []
    for group in product.get("variants", []):
        options = [i for i in group.get("items", []) if not i["name"].lower().startswith("any")]
        names = [i["name"] for i in options]
        selected = next((i["name"] for i in options if i.get("selected")), None)
        selected = selected or next((n for n in names if _contains(query, n)), None)
        if selected:
            groups.append((selected, [n for n in names if n != selected]))
    return groups


def variant_status(title: str, variants: list[tuple[str, list[str]]]) -> str:
    status = "match"
    for selected, others in variants:
        if _contains(title, selected):
            continue
        if any(_contains(title, o) for o in others):
            return "mismatch"
        status = "unconfirmed"
    return status


def returns_allowed(offer: dict) -> bool:
    text = (offer["returns_text"] or "").lower()
    return bool(text) and "not eligible" not in text and "final sale" not in text


def returns_blocked(offer: dict) -> bool:
    text = (offer["returns_text"] or "").lower()
    return "not eligible" in text or "final sale" in text


def normalize_store(store: dict, variants: list[tuple[str, list[str]]]) -> dict:
    details = store.get("details_and_offers", [])
    title = store.get("title", "")
    total = store.get("extracted_total") or store.get("extracted_price")
    price = total if store.get("monthly_payment_duration") else store.get("extracted_price")
    flags = []
    if not _find(details, "in stock"):
        flags.append("availability_unconfirmed")
    status = variant_status(title, variants)
    if status != "match":
        flags.append(f"variant_{status}")
    if "education" in f"{store.get('name', '')} {title}".lower():
        flags.append("conditional_price")
    return {
        "store": store.get("name"),
        "logo": store.get("logo"),
        "link": store.get("link"),
        "title": title,
        "listed_price": price,
        "original_price": store.get("extracted_original_price"),
        "delivery_fee": store.get("shipping_extracted", round(total - price, 2) if total and price else 0),
        "discount": store.get("discount"),
        "coupon": store.get("coupon"),
        "final_price": total,
        "delivery_text": _find(details, "deliver"),
        "returns_text": _find(details, "return") or _find(details, "final sale"),
        "google_tag": store.get("tag"),
        "flags": flags,
    }