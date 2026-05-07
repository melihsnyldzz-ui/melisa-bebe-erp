# Melisa Bebe ERP

![Melisa Bebe ERP Build](https://github.com/melihsnyldzz-ui/melisa-bebe-erp/actions/workflows/build.yml/badge.svg)

Melisa Bebe ERP, Melisa Bebe Tekstil San. ve Tic. Ltd. Şti. için Vega’dan kademeli geçiş amacıyla geliştirilen bağımsız ERP sistemidir.

## Mevcut Durum

- Güncel sürüm: v1.31.0
- Aşama: Stok Riskleri ve Barkod Kalite Kontrol Merkezi
- Build kontrolü: GitHub Actions
- El terminali: okuma, son okutulanlar, sayım sepeti, rapor/CSV/JSON önizleme hazırlığı
- Stok ve barkod kalite kontrolü: pasif/mock risk görünürlüğü

## Güvenli Geliştirme Notu

- Önce okuma, rapor ve önizleme modülleri geliştirilir.
- Veri yazan stok, cari, fiş, yedek, import ve migration işleri küçük ve kontrollü sürümlere bölünür.
- Build geçmeden main branch’e push yapılmamalıdır.

## Manuel Çalışma Modeli

Bu proje manuel kontrollü geliştirme modeliyle ilerler. ChatGPT GitHub main’i kontrol eder ve sonraki Codex promptunu hazırlar. Kullanıcı promptu Codex’e manuel verir. Codex uygulama, build ve commit/push işlemini yapar. Harici mesajlaşma aracı veya tekrarlı işlem akışı kullanılmaz.

## GitHub PR Kontrollü Çalışma Modeli

- Main branch’e doğrudan push yapılmaz.
- Codex her geliştirme için ayrı branch açar.
- Build başarılı olursa PR açılır.
- ChatGPT PR/diff kontrolü yapar.
- Kullanıcı onay verirse merge edilir.
- Gerçek veri bağlantısı ve veri yazma işleri ayrı küçük onaylı fazlarda yapılır.

## Modül Durumu

- Depo Terminali: okuma, son okutulanlar, sayım sepeti, rapor/CSV/JSON önizleme hazırlığı
- Raporlar: yönetim özeti ve veri kalite kontrolü
- Veri Aktarımı: import/export hazırlıkları
- Build: GitHub Actions ile otomatik build kontrolü

## El Terminali ve Barkod Operasyon Fazı

- Bu faz personel kullanımı için barkod/sayım ekranlarını netleştirir.
- Gerçek cihaz bağlantısı yapılmaz.
- Gerçek stok güncellemesi yapılmaz.
- Sayım ve rapor alanları önizleme mantığıyla geliştirilir.
- Gerçek entegrasyon ileride ayrı küçük onaylı fazda ele alınır.

## Stok Riskleri ve Barkod Kalite Kontrol Fazı

- Bu faz stok ve barkod risklerini personel/yönetici için görünür hale getirir.
- Duplicate barkod, barkodsuz ürün, eksik stok kodu ve sayım farkı gibi riskler pasif olarak takip edilir.
- Gerçek düzeltme, import veya veri yazma yapılmaz.
- Gerçek düzeltme akışı ileride ayrı küçük onaylı fazda ele alınır.

## Build Kontrolü

Her main push sonrası GitHub Actions üzerinden `npm ci` ve `npm run build` çalışır.

## Şirket Bilgisayarında Tek Komutla Çalıştırma

Proje klasöründe PowerShell veya Komut İstemi açın:

```bash
npm run desktop
```

`npm start` ve `npm run electron:dev` komutları da aynı masaüstü akışını çalıştırır.

Bu komut şunları otomatik yapar:

- `node_modules` eksikse `npm install` çalıştırır.
- Electron kurulumu bozuk görünüyorsa paketleri yeniler.
- `better-sqlite3` gibi native paketleri Electron sürümüne göre yeniden hazırlar.
- Bu projeden kalmış eski Node/Electron süreçlerini temizler.
- `5173` portu doluysa uygun başka bir port seçip Electron’u o adrese bağlar.
- Vite hazır olmadan Electron penceresini açmaz.

## Manuel Paket Kurulumu

Normalde ilk komut bunu kendisi yapar. Yine de elle kurulum gerekirse:

```bash
npm install
```

## Web Geliştirme Modu

Sadece tarayıcıda Vite geliştirme sunucusu açmak için:

```bash
npm run dev
```

## Eski Geliştirme Süreçlerini Temizleme

Bir önceki çalışmadan kalan süreçleri kapatmak için:

```bash
npm run kill:dev
```

## Electron Native Paketlerini Elle Yenileme

Normalde `npm run desktop` bunu otomatik yapar. `better-sqlite3` için Node/Electron sürüm uyumsuzluğu görülürse elle de çalıştırılabilir:

```bash
npm run electron:rebuild
```

## Build Alma

Web build:

```bash
npm run build
```

Electron installer build:

```bash
npm run electron:build
```

## GitHub’a Gönderirken Dikkat

`node_modules`, `dist`, `build` ve geçici dosyalar GitHub’a gönderilmez. Bu dosyalar `.gitignore` ile hariç tutulmuştur.
