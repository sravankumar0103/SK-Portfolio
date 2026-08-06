// ---------------------------------------------------------------------------
// Lightweight, READ-ONLY access to Sanity content.
//
// This uses a plain `fetch` against Sanity's public query API, so it adds NO
// new dependencies to the portfolio. projectId/dataset are public identifiers
// (not secrets) and are safe to commit.
//
// If Sanity is empty, loading, or unreachable, every section falls back to its
// original hardcoded content — so the live site can never break.
// ---------------------------------------------------------------------------

const PROJECT_ID = '3otp111t';
const DATASET = 'production';
const API_VERSION = '2024-01-01';

// Live API (not the cached CDN) so content edits appear immediately on refresh.
// Traffic for a personal portfolio is well within the live endpoint's limits.
const BASE_URL = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/query/${DATASET}`;

export async function sanityFetch<T>(query: string): Promise<T> {
  const url = `${BASE_URL}?query=${encodeURIComponent(query)}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Sanity request failed: ${res.status}`);
  }
  const json = (await res.json()) as { result: T };
  return json.result;
}

// Add sizing/optimisation params to a resolved Sanity image URL.
export function imageUrl(url: string | undefined | null, width = 1200): string | undefined {
  if (!url) return undefined;
  return `${url}?w=${width}&auto=format&fit=max`;
}
