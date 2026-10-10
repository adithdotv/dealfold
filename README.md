# Dealfold

Search once, compare prices across stores, pay less.

Dealfold is a price comparison web app for shoppers in India. You search for a product, pick the exact variant, and Dealfold compares offers from a dozen or more online stores. It ranks them by total price (product price plus delivery) and explains why the cheapest confirmed offer wins. Dealfold does not sell anything: "Buy now" opens the retailer's own site.

## Live

- App: https://dealfold.vercel.app/

## Features

- Product search with filters (store, free delivery, discount, rating) and sorting
- Product page with a variant picker (storage, colour, size), the lowest confirmed price, a price ladder and specifications
- Store comparison with a price breakdown for every offer
- Offers are left out of the best price when stock isn't confirmed, the listing is for a different variant, the price is unusually low, or the price needs special eligibility (such as education pricing)
- Plain reasons for the winning offer, e.g. "₹2,099 less than the next cheapest store"
- Layout for phones, tablets and desktop

## How it works

1. `GET /api/search` calls SerpApi's Google Shopping engine (`google_shopping`) for the user's query, localized to India.
2. Each result has an `immersive_product_page_token`. `GET /api/product` passes it to the Google Immersive Product engine (`google_immersive_product`) with `more_stores=true`, which returns the product, its variants and the offers from each store.
3. The backend works out each offer's final price and flags problems:
   - stock not confirmed
   - listing title names a different variant
   - listing title doesn't confirm the selected variant
   - price below 70% or above 135% of the median across stores
   - education or other eligibility-only pricing
4. The best offer is the cheapest one with confirmed stock, the right variant, a price that isn't unusually low, and no eligibility condition. Ties go to offers that allow returns, then to offers whose title confirms the variant.

A SerpApi lookup can take up to about 30 seconds, so the app shows a progress screen while it waits. Each search, product view and variant switch is one SerpApi request and counts towards your plan's search limit. The frontend reuses responses for identical requests until the page is reloaded.

## Tech stack

| Part | Stack |
| --- | --- |
| Frontend | React 19, TypeScript, Vite, React Router |
| Backend | Python, FastAPI, Uvicorn, pydantic-settings |
| Data | SerpApi, via the official Python SDK (`serpapi`) |
| Hosting | Vercel (frontend), Render (backend) |

## Project structure

```
dealfold/
├── apps/
│   ├── api/                  Backend (FastAPI)
│   │   ├── app/
│   │   │   ├── main.py       App setup, CORS, health check
│   │   │   ├── config.py     Settings from environment variables
│   │   │   ├── routes/       API endpoints
│   │   │   └── services/     SerpApi calls and comparison logic
│   │   ├── fixtures/         Saved SerpApi responses for offline testing
│   │   └── scripts/          Fixture and comparison helper scripts
│   └── web/                  Frontend (React)
│       └── src/
│           ├── api/          API client and response types
│           ├── components/   Shared UI components
│           ├── hooks/        Data-loading hooks
│           ├── pages/        Home, search, product and compare pages
│           └── utils/        Formatting, routes and offer helpers
├── render.yaml               Render config for the backend
└── package.json              Runs both apps together (Windows only)
```

## Prerequisites

- Python 3.10 or newer (production runs 3.13)
- Node.js 20.19+ or 22.12+
- A SerpApi API key from [serpapi.com](https://serpapi.com/). The free plan includes a limited number of searches per month.

## Backend (`apps/api`)

### Setup

```sh
cd apps/api
python3 -m venv .venv             # Windows: py -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env               # Windows: copy .env.example .env
```

On macOS, `python3` may be the system Python 3.9. Check with `python3 --version`. If it's older than 3.10, create the virtual environment with a newer version instead, e.g. `python3.13 -m venv .venv`.

Open `.env` and add your SerpApi key:

```
SERPAPI_API_KEY=your_serpapi_key
ALLOWED_ORIGINS=http://localhost:5173
```

### Run

With the virtual environment active:

```sh
uvicorn app.main:app --reload --port 8000
```

- Health check: http://localhost:8000/api/health should return `{"status":"ok"}`
- Interactive API docs: http://localhost:8000/docs

### Environment variables

| Variable | Required | Default | Description |
| --- | --- | --- | --- |
| `SERPAPI_API_KEY` | Yes | | Your SerpApi API key |
| `ALLOWED_ORIGINS` | No | `http://localhost:5173` | Comma-separated frontend URLs allowed to call the API (CORS) |
| `SERPAPI_GL` | No | `in` | Google country code |
| `SERPAPI_HL` | No | `en` | Google interface language |
| `SERPAPI_LOCATION` | No | `India` | Location the searches run from |

### API endpoints

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/api/health` | Health check |
| `GET` | `/api/search?q={query}` | Product search. Returns SerpApi's Google Shopping response. |
| `GET` | `/api/product?token={page_token}&q={query}` | Product details, store offers and the best offer. `q` is the original search, used to work out the selected variant. |

### Scripts

Run these from `apps/api` with the virtual environment active.

| Command | What it does | SerpApi requests |
| --- | --- | --- |
| `python scripts/test_compare.py` | Runs the comparison logic on the saved fixtures and prints the best offer and flags for each product. `SERPAPI_API_KEY` must be set, but it isn't used. | 0 |
| `python scripts/inspect_variants.py` | Prints the variant groups and store listings in the saved fixtures | 0 |
| `python scripts/fetch_fixtures.py` | Replaces the fixtures with fresh data for three sample products | Up to 6 |

## Frontend (`apps/web`)

### Setup

```sh
cd apps/web
npm install
```

### Run

Start the backend first, then:

```sh
npm run dev
```

Open http://localhost:5173. In development, Vite forwards `/api` requests to the backend at `http://localhost:8000`, so `VITE_API_BASE_URL` should stay empty.

To point local development at a deployed backend instead, create `apps/web/.env` with:

```
VITE_API_BASE_URL=https://your-backend.onrender.com
```

Restart `npm run dev` after editing `.env`. Vite only reads it on startup.

### Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Starts the development server on port 5173 |
| `npm run build` | Type-checks and builds the app into `dist/` |
| `npm run preview` | Serves the production build locally |
| `npm run lint` | Runs ESLint |

### Environment variables

| Variable | Description |
| --- | --- |
| `VITE_API_BASE_URL` | Backend URL without a trailing slash. Leave empty for local development. It's read at build time, so redeploy after changing it. |

## Running both together (Windows)

After setting up the backend and frontend, run this from the repository root:

```sh
npm install
npm run dev
```

This starts the backend and frontend in one terminal. The backend script uses the Windows virtual environment path (`.venv\Scripts\uvicorn`), so on macOS and Linux, run the backend and frontend in two terminals as described above.

## Deployment

### Backend on Render

`render.yaml` defines the service: root directory `apps/api`, Python 3.13.4, build command `pip install -r requirements.txt`, start command `uvicorn app.main:app --host 0.0.0.0 --port $PORT`, and health check `/api/health`.

1. In Render, create a new Blueprint from this repository.
2. Set `SERPAPI_API_KEY`, and set `ALLOWED_ORIGINS` to the frontend URL, e.g. `https://dealfold.vercel.app`. Both are marked `sync: false`, so their values live in the Render dashboard, not in the repository.

On Render's free plan, the backend sleeps when idle, and the first request after that takes longer while it starts up.

### Frontend on Vercel

1. Import the repository into Vercel and set the root directory to `apps/web`. Vercel detects Vite and builds with `npm run build` into `dist/`.
2. Set `VITE_API_BASE_URL` to the Render backend URL.
3. `vercel.json` sends every path to `index.html`, so pages like `/search` and `/product` load correctly when opened directly or refreshed.
