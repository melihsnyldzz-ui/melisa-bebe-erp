# DRY RUN RAPORU

KONTROL:
Asagidaki dry-run raporunu kontrol et. Gercek codex exec calistirilmadi ve build calistirilmadi. Lutfen riskleri, eksikleri ve Codex'e verilecek siradaki guvenli promptu hazirla.

Kurallar:
- Canli siteye deploy yok.
- Git push yok.
- Veritabani yazma yok.
- .env, API key, sifre veya token okuma/yazma yok.
- Riskli islem varsa STOP de.

Dry-run raporu:
````text
# DRY RUN RAPORU

Task bulundu mu? Evet
Input risk var mi? Hayir
Output risk var mi? Hayir
Karar: CONTINUE
STOP tetiklendi mi? Hayir
codex exec calistirildi mi? Hayir
build calistirildi mi? Hayir
git diff ozeti uretildi mi? Evet

## Risk karari

- riskSource: none
- riskReason: (none)
- matchedLine: (none)
- action: CONTINUE

## Task

```text
# Agent Loop Task

ERP ürün geliştirme hattı başlatıldı. İlk hedef v1.81.0 için mevcut yapıyı bozmadan analiz ve roadmap oluşturmak.
```

## git diff --stat

Exit code: 0

### stdout
```text
package.json | 8 +++++++-
 1 file changed, 7 insertions(+), 1 deletion(-)
```

### stderr
```text
warning: in the working copy of 'package.json', LF will be replaced by CRLF the next time Git touches it
```
````

Git diff ozeti:
````text
## git diff --stat

Exit code: 0

### stdout
```text
package.json | 8 +++++++-
 1 file changed, 7 insertions(+), 1 deletion(-)
```

### stderr
```text
warning: in the working copy of 'package.json', LF will be replaced by CRLF the next time Git touches it
```
````

Orijinal gorev:
```text
# Agent Loop Task

ERP ürün geliştirme hattı başlatıldı. İlk hedef v1.81.0 için mevcut yapıyı bozmadan analiz ve roadmap oluşturmak.
```

Lutfen cevabinin sonunda su basligi kullan:

CODEX'E VERILECEK SIRADAKI PROMPT