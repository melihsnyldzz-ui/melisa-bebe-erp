# Agent Loop STOP Kuralları

Bu agent-loop sadece yerel çalışır. Prompt hazırlar, preflight kontrolü yapar, yerel komut çıktısını alır ve Markdown raporu yazar.

## İzinli İşler

- Normal proje dosyalarını okumak.
- Bu repo içindeki yerel doküman veya görev dosyalarını düzenlemek.
- `git diff` ve `git status` ile durumu incelemek.
- `npm run build` veya yerel test komutlarını çalıştırmak.
- Dry-run ve preflight raporu üretmek.

## Yasaklı İşler

- Deploy veya canlı yayınlama.
- Git add, commit, push, pull, reset, checkout, clean, merge veya rebase.
- DB yazma, migration, seed değişikliği, destructive SQL veya gerçek veri mutasyonu.
- `.env`, API key, token, şifre, cPanel bilgisi veya başka secret okuma/yazma.
- Genel dosya silme yasaktır.
- Sadece `agent-loop/` içinde açıkça test/temp amaçlı oluşturulmuş izinli dosyalar temizlenebilir.
- İzinli örnek: `agent-loop/sandbox-check.txt`.
- Yasak örnekler: `src/`, `package.json`, `.env`, config, database ve deployment dosyaları.
- Paket kurulumu veya paket yayımlama.
- Webhook, remote approval, gateway veya dış servis entegrasyonu.

## Durma Koşulları

Yasaklı bir iş tespit edilirse rapora `STOP` yaz ve loop akışını sürdürme. Manuel onay olmadan bir sonraki adıma geçme.
