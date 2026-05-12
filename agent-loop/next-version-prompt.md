# Next Version Prompt

## Recommended Target Version

v1.83.0

## Goal

Stok ve ürün görünürlüğü

## Scope

- ürün kartı görünürlüğü
- son okutulan ürün alanı
- stok bilgisi gösterimi için güvenli hazırlık
- canlı DB bağlantısı yok

## Files To Inspect

- src/pages/Products.jsx
- src/pages/StockMovements.jsx
- agent-loop/
- CHANGELOG.md

## Allowed Actions

- Güvenli dokümantasyon güncellemesi
- Küçük frontend / utils düzenlemesi
- Build/lint/test çalıştırma
- CHANGELOG ve result raporu güncelleme

## Forbidden Actions

- git commit / git push
- deploy / production config
- canlı DB yazma / migration
- .env / secret / token / API key erişimi
- dosya silme
- npm install / npm publish
- dış network erişimi

## Acceptance Criteria

- package.json version 1.83.0 olmalı
- npm run build PASS olmalı
- lint/test yoksa SKIPPED yazmalı
- version-result.md güncellenmeli
- STOP yoksa sonraki versiyon önerilmeli

## STOP Conditions

- agent-loop/stop-rules.md kuralları geçerlidir.
