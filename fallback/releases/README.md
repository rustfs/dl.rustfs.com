Last-known GitHub release snapshots used when `next build` cannot call the
Releases API (typical Cloudflare 403 rate-limit without `GH_TOKEN`).

Refresh after a successful `pnpm run sync:releases` by copying
`data/<repo>/releases.json` here as `<repo>.json`.
