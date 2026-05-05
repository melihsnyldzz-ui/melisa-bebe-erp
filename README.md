# Melisa Bebe ERP

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
