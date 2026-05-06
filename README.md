# Melisa Bebe ERP

![Melisa Bebe ERP Build](https://github.com/melihsnyldzz-ui/melisa-bebe-erp/actions/workflows/build.yml/badge.svg)

Melisa Bebe ERP, Vega'dan kademeli gecis icin gelistirilen bagimsiz ERP sistemidir.

## Mevcut durum

- Guncel surum: v1.10.8
- Asama: Build workflow durum rozeti ve kalite kontrol notu
- El terminali: okuma, son okutulanlar, sayim sepeti, rapor/CSV/JSON onizleme hazirligi
- Build kontrolu: GitHub Actions

## Guvenli gelistirme notu

- Once okuma, rapor ve onizleme modulleri gelistirilir.
- Veri yazan stok, cari, fis, yedek, import ve migration isleri kucuk ve kontrollu surumlere bolunur.
- Build gecmeden main branch'e push yapilmamalidir.

Melisa Bebe Tekstil San. ve Tic. Ltd. Sti. icin gelistirilen Electron masaustu ERP prototipi.

## Sirket bilgisayarinda tek komutla calistirma

Proje klasorunde PowerShell veya Komut Istemi acin:

```bash
npm run desktop
```

`npm start` ve `npm run electron:dev` komutlari da ayni masaustu akisini calistirir.

Bu komut sunlari otomatik yapar:

- `node_modules` eksikse `npm install` calistirir.
- Electron kurulumu bozuk gorunuyorsa paketleri yeniler.
- `better-sqlite3` gibi native paketleri Electron surumune gore yeniden hazirlar.
- Bu projeden kalmis eski Node/Electron sureclerini temizler.
- `5173` portu doluysa uygun baska bir port secip Electron'u o adrese baglar.
- Vite hazir olmadan Electron penceresini acmaz.

## Manuel paket kurulumu

Normalde ilk komut bunu kendisi yapar. Yine de elle kurulum gerekirse:

```bash
npm install
```

## Web gelistirme modu

Sadece tarayicida Vite gelistirme sunucusu acmak icin:

```bash
npm run dev
```

## Eski gelistirme sureclerini temizleme

Bir onceki calismadan kalan surecleri kapatmak icin:

```bash
npm run kill:dev
```

## Electron native paketlerini elle yenileme

Normalde `npm run desktop` bunu otomatik yapar. `better-sqlite3` icin Node/Electron surum uyumsuzlugu gorulurse elle de calistirilabilir:

```bash
npm run electron:rebuild
```

## Build alma

Web build:

```bash
npm run build
```

Electron installer build:

```bash
npm run electron:build
```

## GitHub'a gonderirken dikkat

`node_modules`, `dist`, `build` ve gecici dosyalar GitHub'a gonderilmez. Bu dosyalar `.gitignore` ile haric tutulmustur.
