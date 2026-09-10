# Seattle Day Planner

A visual one-day coffee and attraction planner for friends visiting Seattle. The site uses the supplied photography, lets visitors build and reorder a route, and draws the selected stops on a self-contained schematic map.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

The production output is written to `dist/`.

## Deployment

The repository includes a GitHub Actions workflow at `.github/workflows/deploy.yml`. It builds the Vite app and deploys `dist/` to GitHub Pages whenever changes land on `main`.

The map is intentionally schematic and requires no external map token or runtime service.
