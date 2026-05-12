# Melisa Bebe ERP Agent Loop

## Bu sistem ne işe yarar?

Agent-loop sistemi, ChatGPT tarafından tariflenen hedefleri Codex ile lokal ve güvenli şekilde uygulamak için kullanılır. Hedef versiyon belirlenir, Codex plan çıkarır, güvenli dosyalarda çalışır, build/lint/test sonucunu raporlar ve STOP kurallarında durur.

## Hedef versiyon nasıl değiştirilir?

Hedef versiyon `agent-loop/version-target.json` içindeki `targetVersion` alanından değiştirilir.

Örnek:

```json
{
  "targetVersion": "1.81.0"
}
```

## version-target.json nasıl kullanılır?

Bu dosya hedef versiyonu, maksimum iteration sayısını ve hangi otomatik işlemlere izin verildiğini tanımlar. Varsayılan mod `version-target-loop` olarak çalışır.

## npm run agent:version ne yapar?

`npm run agent:version` şu adımları çalıştırır:

- `package.json` mevcut version değerini okur.
- `agent-loop/version-target.json` hedefini okur.
- Risk guard çalıştırır.
- `agent-loop/version-plan.md` üretir veya günceller.
- `npm run build` çalıştırır.
- `lint` scripti varsa çalıştırır, yoksa `SKIPPED` yazar.
- `test` scripti varsa çalıştırır, yoksa `SKIPPED` yazar.
- `package.json` version değerini hedef versiyona günceller.
- `CHANGELOG.md` oluşturur veya günceller.
- `agent-loop/version-result.md` içine final raporu yazar.

## npm run agent:loop ne yapar?

`npm run agent:loop` hızlı hazırlık akışıdır. Task dosyasını okur, mevcut değişiklikleri risk açısından gözden geçirir ve `agent-loop/generated-codex-prompt.md` üretir.

## STOP kuralları nelerdir?

Sistem şu işlemlerde durur:

- git commit veya git push
- deploy veya production config değişikliği
- canlı DB yazma veya migration
- `.env`, secret, token, API key okuma/yazma
- dosya veya klasör silme
- hosting, cPanel veya Turhost işlemleri
- ödeme, abonelik, fatura veya panel ayarı değiştirme

## Hangi işlemler otomatik yapılmaz?

Agent-loop commit, push, deploy, canlı DB işlemi, secret erişimi, dış onay servisi, webhook, Telegram/OpenClaw akışı veya hosting panel işlemi yapmaz.

## Sonuç nereden okunur?

Ana sonuç dosyası:

- `agent-loop/version-result.md`

Plan dosyası:

- `agent-loop/version-plan.md`

Üretilen Codex promptu:

- `agent-loop/generated-codex-prompt.md`

## npm run agent:auto ne yapar?

`npm run agent:auto`, Autonomous ERP Development Loop komutudur. Mevcut `package.json` version değerini, `ERP_ROADMAP.md`, `agent-loop/version-result.md` ve `agent-loop/task.md` dosyalarını okuyarak sıradaki güvenli hedef versiyonu seçer. Sonra `version-target.json` ve `task.md` dosyalarını günceller, mevcut `agent:version` hattını çalıştırır, sonucu `version-result.md` içine yazar ve bir sonraki öneri için `next-version-prompt.md` üretir.

## autonomous-config.json ne işe yarar?

`agent-loop/autonomous-config.json`, autonomous loop sınırlarını belirler. Maksimum kaç versiyon ilerlenebileceği, kaç iteration denenebileceği, changelog/version/task güncellemelerinin otomatik olup olmadığı ve STOP kurallarında insan onayı gerekip gerekmediği burada tutulur.

## autonomous-state.json ne işe yarar?

`agent-loop/autonomous-state.json`, son tamamlanan versiyonu, mevcut hedefi, önerilen sonraki versiyonu, son çalışma durumunu ve kaç kez çalıştırıldığını kaydeder.

## maxVersionsPerRun neden 1?

Başlangıçta tek çalıştırmada yalnızca bir versiyon ilerlemek daha güvenlidir. Böylece build, lint, test ve risk raporu her hedeften sonra kontrol edilebilir. Sistem olgunlaştıkça bu değer dikkatli şekilde artırılabilir.

## STOP durumunda ne olur?

STOP durumunda riskli işlem yapılmaz. Sebep `agent-loop/version-result.md` ve `agent-loop/autonomous-state.json` içine yazılır. Loop durur ve insan kontrolü gerekir.

## İnsan onayı gerektiren işler neler?

Git commit, git push, deploy, canlı DB yazma, migration, `.env` veya secret erişimi, hosting/cPanel/Turhost işlemleri, production config değişikliği ve ödeme/abonelik/fatura/domain işlemleri insan onayı gerektirir.

## Git commit/push/deploy neden otomatik yapılmaz?

Bu işlemler geri dönüşü zor üretim etkileri yaratabilir. Agent-loop lokal geliştirme, raporlama ve kalite kapısı için tasarlanmıştır; yayınlama ve kalıcı git işlemleri ayrı bir onay adımıyla yapılmalıdır.
