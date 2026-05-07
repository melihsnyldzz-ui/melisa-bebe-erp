# Melisa Bebe ERP

![Melisa Bebe ERP Build](https://github.com/melihsnyldzz-ui/melisa-bebe-erp/actions/workflows/build.yml/badge.svg)

Melisa Bebe ERP, Melisa Bebe Tekstil San. ve Tic. Ltd. Şti. için Vega’dan kademeli geçiş amacıyla geliştirilen bağımsız ERP sistemidir.

## Mevcut Durum

- Güncel sürüm: v1.40.0
- Aşama: Read-only Bağlantı Öncesi Final Güvenlik Kapanışı
- Build kontrolü: GitHub Actions
- El terminali: okuma, son okutulanlar, sayım sepeti, rapor/CSV/JSON önizleme hazırlığı
- Stok ve barkod kalite kontrolü: pasif/mock risk görünürlüğü

## Güvenli Geliştirme Notu

- Önce okuma, rapor ve önizleme modülleri geliştirilir.
- Veri yazan stok, cari, fiş, yedek, import ve migration işleri küçük ve kontrollü sürümlere bölünür.
- Build geçmeden main branch’e push yapılmamalıdır.

## GitHub Main Üzerinden Manuel Codex Çalışma Modeli

- Main branch bilgisayarda güncel tutulur.
- Codex değişiklikleri local main üzerinde uygular.
- Build başarılıysa commit ve push yapılır.
- ChatGPT GitHub main’i kontrol eder.
- Kritik veri bağlantısı ve veri yazma işleri küçük, ayrı ve açık onaylı sürümlerle yapılır.
- Bu model UI, mock ekranlar, pasif rehberler, CSS, README ve yönetici panelleri için kullanılır.

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

## Cari ve Alacak Riskleri Fazı

- Bu faz cari, alacak, vade ve tahsilat risklerini patron/yönetici için görünür hale getirir.
- Gecikmiş alacak, yakın vade, kritik risk ve düzenli müşteri ayrımı pasif olarak gösterilir.
- Gerçek tahsilat, ödeme, cari kart güncelleme veya veri yazma yapılmaz.
- Gerçek finansal işlem akışı ileride ayrı küçük onaylı fazda ele alınır.

## Alış Satış ve Kârlılık Fazı

- Bu faz alış, satış, kâr marjı, marka/kategori performansı ve ticari riskleri patron/yönetici için görünür hale getirir.
- Düşük marj, yüksek stok, yavaş satış ve maliyet belirsizliği gibi riskler pasif olarak takip edilir.
- Gerçek satış, alış, fiyat güncelleme veya veri yazma yapılmaz.
- Gerçek ticari işlem akışı ileride ayrı küçük onaylı fazda ele alınır.

## Raporlama ve Yönetici Karar Merkezi Fazı

- Bu faz stok, barkod, cari, alacak, kârlılık, saha operasyonu ve Vega hazırlık durumlarını tek yönetici rapor mantığında toplar.
- Raporlar pasif/mock görünürlük sağlar.
- Gerçek veri okuma, rapor export, kayıt oluşturma veya veri yazma yapılmaz.
- Gerçek raporlama bağlantısı ileride ayrı küçük onaylı fazda ele alınır.

## Canlı Kullanım Öncesi Operasyon Test Fazı

- Bu faz patron, personel, saha ve güvenlik testlerini tek hazırlık merkezi altında toplar.
- Testler pasif/mock görünürlük sağlar.
- Gerçek bağlantı, cihaz entegrasyonu, rapor export, kayıt oluşturma veya veri yazma yapılmaz.
- Gerçek read-only bağlantı ve canlı kullanım denemesi ileride ayrı küçük onaylı fazlarda ele alınır.

## Mavi Nokta ve Yeni Sürüm Görünürlüğü

- Sol menüdeki mavi nokta güncel release highlight yapısına göre çalışır.
- Güncel sürümde değişen sayfalar sol menüde işaretlenir.
- Dashboard, Raporlar ve Ayarlar sayfaları v1.35.x görünürlüğüyle uyumlu tutulur.

## Modül Olgunluk ve Canlıya Hazırlık Skor Fazı

- Bu faz ERP modüllerinin canlıya hazırlık seviyesini yüzdeli ve yönetici odaklı olarak gösterir.
- Dashboard, raporlama, el terminali, stok/barkod, cari/alacak, kârlılık ve Vega read-only hazırlığı tek skor mantığında toparlanır.
- Gerçek bağlantı, cihaz entegrasyonu, rapor export, kayıt oluşturma veya veri yazma yapılmaz.
- İlk gerçek read-only bağlantı ileride ayrı küçük onaylı fazda ele alınır.

## Vega Read-only Teknik Ön Kapı Fazı

- Bu faz ilk gerçek Vega read-only bağlantıdan önce teknik güvenlik şartlarını görünür hale getirir.
- Manuel yedek, read-only kullanıcı, 20 satır sınırı, timeout ve ham hata gizleme politikası vurgulanır.
- Bu sürüm gerçek bağlantı, DB okuma, query, API veya veri yazma yapmaz.
- İlk gerçek read-only bağlantı ileride ayrı küçük onaylı fazda ele alınır.

## Read-only İlk Deneme Planı ve Geri Dönüş Fazı

- Bu faz ilk gerçek Vega read-only bağlantıdan önce manuel yedek, rollback, başarısızlık senaryosu ve test sonrası değerlendirme akışını görünür hale getirir.
- Bu sürüm gerçek bağlantı, DB okuma, query, API veya veri yazma yapmaz.
- İlk gerçek read-only bağlantı ileride ayrı küçük onaylı fazda ele alınır.
- Başarısızlıkta tekrar deneme yapılmadan önce rapor hazırlanır.

## Read-only İlk Deneme Son Karar Fazı

- Bu faz ilk gerçek Vega read-only bağlantı öncesi başla/başlama karar kriterlerini görünür hale getirir.
- Manuel yedek, read-only kullanıcı, 20 satır sınırı, rollback ve hata yönetimi son kez kontrol edilir.
- Bu sürüm gerçek bağlantı, DB okuma, query, API veya veri yazma yapmaz.
- İlk gerçek read-only bağlantı bir sonraki ayrı küçük onaylı fazda ele alınabilir.

## Read-only Bağlantı Öncesi Final Güvenlik Kapanışı Fazı

- Bu faz ilk gerçek Vega read-only bağlantı öncesi hazırlık sürecini güvenlik açısından kapatır.
- Kapalı kilitler, yapılmayacak işlemler ve sonraki küçük bağlantı fazının sınırları görünür hale getirilir.
- Bu sürüm gerçek bağlantı, DB okuma, query, API, connection test veya veri yazma yapmaz.
- Sonraki faz yalnızca küçük, sınırlı ve read-only stok kartı okuma denemesi olabilir.

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
