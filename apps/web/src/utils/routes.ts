export function searchPath(query: string): string {
  return `/search?q=${encodeURIComponent(query)}`
}

export function productPath(token: string, query: string): string {
  return `/product?${new URLSearchParams({ token, q: query })}`
}

export function comparePath(token: string, query: string): string {
  return `/product/compare?${new URLSearchParams({ token, q: query })}`
}
