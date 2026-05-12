# Melisa Bebe ERP Roadmap

## Current Development Line

- Current package version: `1.0.0`
- Product shape: React/Vite ERP prototype with Electron desktop packaging.
- Main modules observed: dashboard, products, stock movements, customers, suppliers, sales slips, purchase slips, payments, collections, reports, and settings.
- Near-term principle: improve safely without changing working UI flows, database behavior, or live deployment state.

## v1.81.0 — Guvenli Temel Iyilestirme

- Map current screens, data flows, and desktop bridge boundaries.
- Keep changes small, local, and reversible.
- Use `npm run build` as the current quality gate because no separate lint/typecheck/test scripts exist yet.
- Document risks before changing shared ERP behavior.
- Mevcut modül envanteri çıkarıldı.

## v1.82.0 — Barkod Terminali Iyilestirmeleri

- Review barcode-oriented product lookup and stock movement flows.
- Identify scan input expectations, error states, and operator feedback gaps.
- Prepare improvements without changing stock data semantics prematurely.

## v1.83.0 — Stok ve Urun Gorunurlugu

- Improve product and stock visibility for repeated operational use.
- Review table density, filters, critical stock indicators, and movement traceability.
- Keep UI behavior compatible with the current component structure.

## v1.84.0 — Vega Entegrasyon Hazirligi

- Identify integration boundaries and required data contracts.
- Separate preparation notes from actual external integration work.
- Do not connect to external services until the contract and safety rules are approved.

## v1.85.0 — Raporlama ve Operasyon Paneli

- Review reporting needs for daily operations and management summary.
- Prioritize actionable KPIs, exception lists, and operational follow-up views.
- Keep report additions local and build-verified before broader workflow changes.
