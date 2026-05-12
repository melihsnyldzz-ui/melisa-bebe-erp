# Agent Loop Stop Rules

## Amaç

Bu kurallar, Melisa Bebe ERP agent-loop sisteminin lokal ve güvenli kalmasını sağlar. Sistem küçük geliştirmeleri otomatik yapabilir, ancak riskli operasyonlarda durur.

## Kesin Durulacak İşlemler

- git push
- git commit
- deploy
- DB write
- migration
- .env erişimi
- secret/token/API key erişimi
- dosya silme
- production config
- hosting/cPanel/Turhost işlemi

## Yüksek Riskli Dosya ve Klasörler

- .env
- .env.local
- secrets/
- keys/
- config/production
- deploy/
- migrations/
- database/
- db/
- sql/
- cpanel/
- hosting/

## Orta Riskli Dosyalar

- package.json
- vite.config
- tsconfig
- scripts/
- src/api
- src/services
- src/integrations

## Güvenli Dosyalar

- README.md
- CHANGELOG.md
- ERP_ROADMAP.md
- agent-loop/
- docs/
- küçük frontend component düzenlemeleri
- utils içindeki geri alınabilir küçük değişiklikler

## STOP Durumunda Yapılacaklar

- Riskli işlem yapılmaz.
- Terminalde STOP yazılır.
- STOP sebebi agent-loop/version-result.md içine eklenir.
- Kullanıcıdan ayrıca onay gerektiği belirtilir.

## Devam Edilebilecek Durumlar

- Dokümantasyon güncellemesi
- Agent-loop script güncellemesi
- Build/lint/test çalıştırma
- Güvenli hata düzeltmesi
- CHANGELOG ve package.json version güncellemesi
