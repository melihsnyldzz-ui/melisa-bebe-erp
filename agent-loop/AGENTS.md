# Agent Loop Talimatları

Bu klasördeki agent-loop yalnızca yerel dosyalarla çalışır. Görevi okur, güvenlik kontrolü yapar, Codex promptu üretir ve sonucu Markdown raporu olarak yazar.

## Amaç

- `agent-loop/task.md` içindeki görevi okumak.
- Preflight ve dry-run kontrolü yapmak.
- Codex için çalıştırma promptu hazırlamak.
- ChatGPT ile manuel kontrol için metin üretmek.
- Riskli işlem varsa `STOP` ile durmak.

## Kullanım Komutları

- `npm run agent:loop:dry`: Yerel preflight/dry-run raporu üretir.
- `npm run agent:loop:run`: Yerel loop akışını çalıştırır.
- `npm run build`: Gerekirse yerel build kontrolü yapar.

## Güvenlik Kuralları

- Git işlemi yapma: add, commit, push, pull, reset, checkout, merge, rebase.
- Paket kurma veya paket dosyalarını değiştirme.
- `.env`, token, API key, şifre veya pairing code okuma/yazma.
- DB, migration, stok, cari, fiş, ürün veya gerçek veri mutasyonu yapma.
- Deploy, webhook, remote approval, gateway veya dış servis entegrasyonu başlatma.
- Destructive dosya komutları çalıştırma.

## Durma Koşulları

Şu durumlardan biri varsa devam etme ve `STOP` raporla:

- Yasaklı bir işlem görev için gerekli hale gelirse.
- Secret veya kimlik bilgisi gerekiyorsa.
- Yönetici yetkisi ya da dış servis erişimi gerekiyorsa.
- Gerçek veri yazma veya DB değişikliği gerekiyorsa.
- Sıradaki görev ChatGPT tarafından açıkça onaylanmamışsa.

## Dosya Görevleri

- `task.md`: İlk görev.
- `next-codex-prompt.md`: Onaylanan sıradaki görev.
- `chatgpt-review-prompt.md`: Manuel ChatGPT kontrol metni.
- `runs/turn-*.md`: Tur çıktıları.
- `STOP_RULES.md`: Durma ve yasaklı işlem kuralları.
