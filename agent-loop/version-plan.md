# Version Target Plan

## Current Version
1.81.0

## Target Version
1.82.0

## Scope
Bu versiyon hedefi, güvenli temel iyileştirme hattı içindir.
Öncelik agent-loop altyapısı, güvenli review, build/lint/test kontrolü, changelog ve versiyonlama sistemidir.

## Task Context
# Current Goal

v1.82.0 Barkod terminali iyileştirmeleri hattını güvenli şekilde tamamla.

# Context

Melisa Bebe ERP projesinde barkod terminali, stok görünürlüğü, Vega entegrasyon hazırlığı ve operasyon paneli geliştirme hattı devam ediyor.
Bu agent-loop sistemi, ERP_ROADMAP.md ve version-result.md üzerinden sıradaki güvenli hedefi seçerek lokal geliştirme yapar.

# Allowed Actions

- Güvenli dokümantasyon güncellemesi
- Güvenli frontend / utils düzenlemesi
- Build/lint/test çalıştırma
- Hata varsa güvenli dosyalarda düzeltme
- Version ve changelog güncelleme
- Risk raporu oluşturma
- Bir sonraki versiyon için öneri üretme

# Forbidden Actions

- git push
- git commit
- deploy
- canlı DB yazma
- Vega canlı DB yazma
- migration çalıştırma
- secret/API key/token okuma
- .env dosyalarına dokunma
- dosya silme
- npm install
- hosting/cPanel/Turhost işlemi

# Acceptance Criteria

- package.json version 1.82.0 olmalı
- CHANGELOG.md hedef versiyon notunu içermeli
- Build sonucu raporlanmalı
- Lint sonucu raporlanmalı veya SKIPPED yazmalı
- Test sonucu raporlanmalı veya SKIPPED yazmalı
- Risk durumu raporlanmalı
- agent-loop/next-version-prompt.md oluşmalı
- STOP kuralı varsa işlem durmalı

# Latest Result

Autonomous loop bu hedef için başlatıldı.

# Next Prompt

v1.82.0 hedefini güvenli kapsamda uygula. STOP kurallarında dur.

## Roadmap Context
ERP_ROADMAP.md bulundu ve planlama bağlamına alındı.

## Allowed Automatic Actions
- Dokümantasyon güncelleme
- Agent-loop scriptleri ekleme/güncelleme
- Build/lint/test çalıştırma
- Güvenli hata düzeltme
- CHANGELOG güncelleme
- package.json version güncelleme

## Stop Rules
agent-loop/stop-rules.md dosyasındaki kurallar geçerlidir.

## Iteration Log
- Maksimum iteration: 3
- Iteration 1 başlatıldı.

## Final Acceptance Criteria
- npm run agent:version çalışmalı
- version-result.md oluşmalı
- package.json version 1.82.0 olmalı
- risk raporu oluşmalı
- build sonucu yazmalı
- lint/test sonucu yazmalı veya SKIPPED olmalı
