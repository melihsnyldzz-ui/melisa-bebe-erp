# Melisa Bebe ERP

Melisa Bebe Tekstil San. ve Tic. Ltd. Şti. için geliştirilen web tabanlı ERP prototipi.

## Kurulum

```bash
npm install
```

## Geliştirme ortamında çalıştırma

```bash
npm run dev
```

## Masaüstü uygulama olarak çalıştırma

```bash
npm run electron:dev
```

## Electron geliştirme ortamı

Masaüstü uygulamayı çalıştırmak için:

```bash
npm run electron:dev
```

Eğer "Port 5173 is already in use" hatası alınırsa:

```bash
npm run kill:dev
```

Sonra tekrar:

```bash
npm run electron:dev
```

## Build alma

```bash
npm run build
```

## GitHub’a gönderirken dikkat

node_modules, dist, build ve geçici dosyalar GitHub’a gönderilmez. Bu dosyalar .gitignore ile hariç tutulmuştur.
