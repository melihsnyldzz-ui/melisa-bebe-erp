# Local Orchestrator Prompt

Melisa Bebe ERP icin lokal agent-loop akisini guvenli sekilde yonlendir.

## Komut esleme

- Preflight/dry-run -> `npm run agent:loop:dry`
- Gercek lokal Codex dongusu -> `npm run agent:loop`

## Davranis

Akis sadece lokal dosyalari, git diff bilgisini, build/test ciktisini ve Markdown raporlarini kullanir.

Webhook, remote approval, gateway ve dis servis entegrasyonlari simdilik kapsam disidir. Otomatik git, dependency, DB, migration veya veri yazma islemi yapmaz.
