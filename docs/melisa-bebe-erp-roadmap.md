# Melisa Bebe ERP — Uzun Soluklu Yol Haritası

Bu doküman Melisa Bebe ERP projesinin güvenli, fazlı ve uzun vadeli ilerleme planını özetler.

## Güvenlik İlkeleri

- `sa` ERP içinde asla kullanılmayacak.
- SQL erişimi sadece `melisa_stock_ro` read-only kullanıcısı ile yapılacak.
- `.env.local`, credential, token, secret yazdırılmayacak.
- INSERT / UPDATE / DELETE yok.
- ALTER / DROP / TRUNCATE / CREATE yok.
- GRANT / DENY / REVOKE yok.
- import / export / sync yok.
- Cari / kasa / finans / fatura kapsam dışı.
- TOP 20 limiti korunacak.
- Fail-closed modeli zorunlu.

## Mevcut Karar Durumu

| Alan | Durum | İlerleme |
| --- | --- | ---: |
| SQL bağlantısı | HAZIR | 100% |
| Read-only güvenlik | HAZIR | 100% |
| İlk gerçek stok testi | HAZIR | 100% |
| Barkod-ürün eşleşmesi | HAZIR | 100% |
| Electron desktop çalışma | HAZIR | 100% |
| Barkod okutma terminal pilot UI | HAZIR / local doğrulandı | 100% |
| Terminal kullanım sertleştirme | DEVAM | 0% |
| Depo terminal MVP | DEVAM | 35% |
| Stok görünürlük paneli | DEVAM | 20% |
| Satış destek paneli | DEVAM | 10% |
| Web katalog bağlantısı | DEVAM | 5% |
| Operasyon paneli | BEKLEMEDE | 0% |
| Kontrollü write hazırlığı | BEKLEMEDE | 0% |

## v9.8.0 — Barkod Okutma Terminal Pilot UI

Karar: HAZIR.

Local / Electron testinde doğrulanan pilot akış:

- Barkod input otomatik focus alır.
- Enter ile arama çalışır.
- Arama sonrası input temizlenir ve tekrar focus alır.
- Son bulunan ürün büyük kartta gösterilir.
- Son 10 geçici okutma geçmişi tutulur.
- Aynı barkod 1 saniye içinde tekrar okutulursa tekrar okuma uyarısı gösterilir.
- 20 karakter üstü barkod fail-closed mesajıyla sorguya gitmeden durur.
- Yeni veri yazma / import / export / sync eklenmez.
- Mevcut parametreli read-only barkod araması kullanılır.

Doğrulanan gerçek test barkodu:

```text
Barkod: 9452549221582
STOKKODU: 2158 NOY NOY
MALINCINSI: BATİK FIRFIRLI ÇİÇEK AKSESUAR ELBİSE
STOKNO: 51652
ACIKLAMA: FIYAT
```

## v9.9.0 — Terminal Kullanım Sertleştirme

Hedef: Barkod okutma ekranını depo personeli için daha güvenli, okunaklı ve hata toleranslı hale getirmek.

Kapsam:

- Boş barkod sorguya gitmesin.
- Barkod sadece rakamlardan oluşsun.
- Minimum 8, maksimum 20 karakter kontrolü olsun.
- Duplicate kontrolü korunsun.
- Bulundu / bulunamadı / tekrar okuma / geçersiz barkod / hata durumları ayrı gösterilsin.
- Arama başarılı, başarısız veya hatalı olsa bile input tekrar focus alsın.
- Son bulunan ürün kartı terminal ekranına uygun büyütülsün.
- Son 10 okutma geçmişi korunsun.
- Geçmiş listesinde durum etiketi gösterilsin.

Kesin sınırlar:

- Yeni SQL sorgusu veya servis fonksiyonu eklenmeyecek.
- Mevcut parametreli read-only barkod araması kullanılacak.
- Write, sync, import, export eklenmeyecek.
- Cari / kasa / finans / fatura alanlarına dokunulmayacak.
- `.env.local`, token, credential, secret okunmayacak veya yazdırılmayacak.
- `agent-loop` ve `melisababy-deploy` alanlarına dokunulmayacak.

## v10.0.0 — Depo Terminal MVP

Hedef: Depo personeline verilebilecek ilk gerçek read-only terminal MVP.

Beklenen yetenekler:

- Terminal-first ekran.
- Barkod okutma odaklı kullanım.
- Büyük ürün kartı.
- Net hata / uyarı mesajları.
- Bağlantı yoksa güvenli kapanma mesajı.
- Vega’ya yazmadan ürün doğrulama.

## Orta Vadeli Fazlar

### Faz 2 — Stok Görünürlük Paneli

- Stok hareket detay ekranı.
- Depo bazlı stok görünümü.
- Barkod + stok hareket birleşik ekran.
- Ürün arama: barkod, stok kodu, ürün adı.
- Stok dashboard.
- Azalan ürünler görünümü.
- Son giriş / son çıkış bilgileri.

### Faz 3 — Satış Destek Paneli

- Ürün hızlı arama ekranı.
- Satışçı için sade ürün ekranı.
- Fotoğraf alanı altyapısı.
- WhatsApp’a kopyalanabilir ürün metni.
- Fiyat yetki ayrımı.
- Satış destek MVP.

### Faz 4 — Ürün Kataloğu / Web Bağlantısı

- Kategori eşleştirme.
- Marka / yaş / cinsiyet filtreleri.
- Görsel klasör mantığı.
- Fiyat gizli katalog modu.
- WhatsApp teklif isteme butonu.
- İngilizce katalog alanı.

### Faz 5 — Operasyon Paneli

- Günlük görev ekranı.
- Satışçı takip listesi.
- WhatsApp müşteri notları.
- Instagram müşteri notları.
- Potansiyel müşteri listesi.
- Patron dashboard.

### Faz 6 — Kontrollü Write Öncesi Hazırlık

Bu faz sadece hazırlıktır. Vega’ya yazma içermez.

- Write risk analizi.
- Ayrı test database planı.
- Log sistemi.
- Yetki sistemi.
- Onay ekranı altyapısı.
- Yazma simülasyon modu.
- Write-ready güvenlik mimarisi.

## Uzun Vadeli Vizyon

Melisa Bebe ERP sadece stok ekranı değil; depo, satış, katalog, WhatsApp, Instagram, lead toplama, personel görevleri ve patron dashboard alanlarını birleştiren işletim paneline dönüşmelidir.

Final hedef:

```text
Melisa Bebe ERP = Depo + Stok + Satış Destek + Katalog + Müşteri Kazanım Merkezi
```
