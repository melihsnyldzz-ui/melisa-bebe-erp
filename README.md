# Melisa Bebe ERP

![Melisa Bebe ERP Build](https://github.com/melihsnyldzz-ui/melisa-bebe-erp/actions/workflows/build.yml/badge.svg)

Melisa Bebe ERP, Melisa Bebe Tekstil San. ve Tic. Ltd. Şti. için Vega’dan kademeli geçiş amacıyla geliştirilen bağımsız ERP sistemidir.

## Mevcut Durum

- Güncel sürüm: v1.27.1
- Aşama: Manuel çalışma modeli ve loop kalıntılarını temizleme
- Build kontrolü: GitHub Actions
- El terminali: okuma, son okutulanlar, sayım sepeti, rapor/CSV/JSON önizleme hazırlığı

## Güvenli Geliştirme Notu

- Önce okuma, rapor ve önizleme modülleri geliştirilir.
- Veri yazan stok, cari, fiş, yedek, import ve migration işleri küçük ve kontrollü sürümlere bölünür.
- Build geçmeden main branch’e push yapılmamalıdır.

## Manuel Çalışma Modeli

Bu proje manuel kontrollü geliştirme modeliyle ilerler. ChatGPT GitHub main’i kontrol eder ve sonraki Codex promptunu hazırlar. Kullanıcı promptu Codex’e manuel verir. Codex uygulama, build ve commit/push işlemini yapar. Harici mesajlaşma aracı veya tekrarlı işlem akışı kullanılmaz.

## Modül Durumu

- Depo Terminali: okuma, son okutulanlar, sayım sepeti, rapor/CSV/JSON önizleme hazırlığı
- Raporlar: yönetim özeti ve veri kalite kontrolü
- Veri Aktarımı: import/export hazırlıkları
- Build: GitHub Actions ile otomatik build kontrolü

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
