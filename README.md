# Melisa Bebe ERP

![Melisa Bebe ERP Build](https://github.com/melihsnyldzz-ui/melisa-bebe-erp/actions/workflows/build.yml/badge.svg)

Melisa Bebe ERP, Melisa Bebe Tekstil San. ve Tic. Ltd. Şti. için Vega’dan kademeli geçiş amacıyla geliştirilen bağımsız ERP sistemidir.

## Mevcut Durum

- Güncel sürüm: v1.55.0
- Aşama: Stok Alan Anlamlandırma ve Doğrulama Hazırlığı
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

## Read-only Bağlantı Altyapısı Pasif Teknik İskelet Fazı

- Bu faz ilk gerçek Vega read-only bağlantıdan önce kapalı/pasif teknik iskeleti görünür hale getirir.
- Bağlantı modu, SQL/ODBC, DB okuma, query, connection test, API ve veri yazma kilitleri kapalıdır.
- Bu sürüm gerçek bağlantı, DB okuma, query, API veya veri yazma yapmaz.
- İlk gerçek bağlantı ileride ayrı küçük onaylı fazda ele alınır.

## Read-only İlk Bağlantı Operatör Checklist Fazı

- Bu faz ilk gerçek read-only bağlantıdan önce operatör, teknik sorumlu ve patronun manuel kontrol listesini görünür hale getirir.
- Gerçek bağlantı, SQL/ODBC, DB okuma, query, connection test, API veya veri yazma yapılmaz.
- Bir sonraki faz yalnızca küçük ve sınırlı read-only bağlantı denemesi olabilir.

## Read-only Öncesi Son Güvenlik Tarama Fazı

- Bu faz ilk gerçek read-only bağlantıdan önce sürüm, mavi nokta, pasif teknik iskelet ve güvenlik metinlerini son kez kontrol eder.
- Gerçek bağlantı, DB okuma, query, API, credential, connection test veya veri yazma yapılmaz.
- Bir sonraki faz küçük ve sınırlı ilk read-only bağlantı denemesi olabilir.

## Read-only Fail-closed Hazırlık Kabuğu Fazı

- Bu faz ilk gerçek read-only bağlantıdan önce fail-closed güvenlik prensibini görünür hale getirir.
- Eksik yedek, doğrulanmamış read-only kullanıcı, kapsam aşımı, ham hata riski veya yazma yetkisi şüphesinde bağlantı denenmez.
- Bu sürüm gerçek bağlantı, DB okuma, query, connection test, API, credential veya veri yazma yapmaz.
- İlk gerçek bağlantı ileride ayrı küçük onaylı fazda ele alınır.

## Read-only Bağlantı Ortam Bilgisi Manuel Hazırlık Fazı

- Bu faz ilk gerçek read-only bağlantıdan önce SQL Server, DB adı, read-only kullanıcı, manuel yedek, test bilgisayarı ve test ortamı kararlarını görünür hale getirir.
- Bu bilgiler bu projede tutulmaz; yalnızca manuel hazırlık rehberi gösterilir.
- Gerçek bağlantı, DB okuma, query, connection test, API, credential veya veri yazma yapılmaz.
- İlk gerçek bağlantı ileride ayrı küçük onaylı fazda ele alınır.

## İlk Gerçek Read-only Stok Kartı Okuma Denemesi

- Bu faz yalnızca local bilgisayarda çalışan sınırlı read-only smoke test scripti ekler.
- Test canlı Vega üzerinde yapılacaksa manuel yedek alınmış ve read-only kullanıcı doğrulanmış olmalıdır.
- Script sadece F0102TBLSTOKLAR tablosundan en fazla 20 stok kartı okur.
- Sonuç sadece terminalde gösterilir.
- ERP’ye yazma, import, cari/fiş/hareket okuma, dosyaya çıktı alma yoktur.
- Bağlantı bilgileri .env.local içinde tutulur ve GitHub’a gönderilmez.

## Electron Desktop Güvenlik ve Hazırlık Merkezi

- Bu faz Melisa Bebe ERP'nin local desktop kullanım hissini ve güvenli entegrasyon görünürlüğünü güçlendirir.
- ERP arayüzünden canlı Vega bağlantısı başlatılmaz; son güvenli entegrasyon seviyesi v1.45.0 read-only stock smoke olarak gösterilir.
- Vega bağlantısı sadece terminal smoke test seviyesinde kalır; veri yazma, canlı import ve .env.local paylaşımı kapalıdır.

## Read-only Smoke Test Hata Sınıfları

- `ENV_MISSING`: `.env.local` yoktur veya zorunlu alanlardan biri eksiktir; bağlantı denenmez.
- `SQL_AUTH_FAILED`: SQL kullanıcı adı, şifre veya login doğrulaması başarısız olabilir; bağlantı bilgileri gizlenir.
- `SQL_NETWORK_FAILED`: SQL Server, instance veya port erişilemiyor olabilir; server bilgisi terminale basılmaz.
- `SQL_PERMISSION_DENIED`: Read-only kullanıcının stok tablosunu okuma yetkisi eksik olabilir.
- `SQL_TABLE_OR_COLUMN_MISMATCH`: `F0102TBLSTOKLAR` tablosu veya beklenen stok kolonları ortamla uyumsuz olabilir.
- `SQL_TIMEOUT`: Bağlantı veya sorgu kısa timeout hedefini aşmıştır.
- `SQL_UNKNOWN_SAFE`: Hata güvenli şekilde sınıflandırılamamıştır; ham hata ve credential bilgisi gösterilmez.

## Vega Stok Kartı Alan Haritası

- Bu faz read-only smoke test kolonlarını ERP tarafında pasif dokümantasyon olarak anlamlandırır.
- `IND`, `STOKKODU` ve `MALINCINSI` yüksek güvenli teknik/stok/ürün adı adaylarıdır.
- `KOD1`, `KOD2`, `KOD4` ve `KOD6` düşük güvenli sınıflandırma alanlarıdır; gerçek örnek satırlarla doğrulanmalıdır.
- `ALISFIYATI`, `ISKSATISFIYATI2`, `ISKSATISFIYATI3` ve `KDVGRUBU` orta güvenli fiyat/KDV adaylarıdır.
- Bu alan haritası kesin muhasebe/operasyon kararı değildir. Gerçek Vega verisiyle örnek satırlar incelendikten sonra kesinleştirilecektir.
- Bu faz yeni SQL sorgusu, ERP arayüzünden bağlantı, canlı veri çekme, veri yazma, import veya dosyaya çıktı eklemez.

## Pasif Vega Bağlantı Durumu

- Bu faz ERP içinde Vega entegrasyon seviyesini yalnızca durum görünürlüğü olarak gösterir.
- Vega bağlantı modu kapalıdır; ERP arayüzünden canlı bağlantı başlatılmaz.
- SQL/Vega bağlantısı yalnızca local terminalde `npm run vega:readonly-stock-smoke` smoke test seviyesinde kalır.
- Güvenli kapsam `F0102TBLSTOKLAR` ve en fazla 20 stok kartıdır.
- Veri yazma, import/senkron, cari/fiş/hareket okuma ve canlı veri çıktısı kapalıdır.
- Bu ekran canlı Vega bağlantısı başlatmaz. Bağlantı testleri yalnızca local terminalden ve read-only smoke test olarak yapılır.

## İlk Kapalı Beta Desktop Hazırlığı

- Bu faz Melisa Bebe ERP'nin patron bilgisayarında kapalı beta olarak denenmeye hazır olduğunu gösterir.
- Kapalı beta yalnızca masaüstü uygulama akışını, ekranları, menüleri ve güvenlik kilitlerini test eder.
- Uygulama modu Local Desktop, kurulum hedefi Windows masaüstüdür.
- Canlı Vega bağlantısı, ERP arayüzünden SQL bağlantısı, veri yazma, import/senkron ve cari/fiş/hareket okuma kapalıdır.
- SQL/Vega bağlantısı hâlâ sadece local terminalde `npm run vega:readonly-stock-smoke` smoke test seviyesinde kalır.
- Electron paket kontrolü `npm run electron:build` ile manuel doğrulama bekler.
- Bu kapalı beta sürümü canlı Vega'ya arayüzden bağlanmaz ve veri yazmaz. Amaç masaüstü uygulama akışını, ekranları ve güvenlik kilitlerini patron bilgisayarında test etmektir.

## İlk Başarılı Read-only Vega Stok Okuma Kanıtı

- İlk read-only stok smoke test başarılı oldu.
- 20 stok kartı okundu.
- Okunan kolonlar: `IND`, `STOKKODU`, `MALINCINSI`, `KOD1`, `KOD2`, `KOD4`, `KOD6`, `ALISFIYATI`, `ISKSATISFIYATI2`, `ISKSATISFIYATI3`, `KDVGRUBU`.
- Veri yazma, import, senkron, cari/fiş/hareket okuma yapılmadı.
- Sonuç dosyaya yazılmadı.
- Gerçek stok verileri repoya eklenmedi.
- SQL kullanıcı bilgileri ve bağlantı bilgileri repoya eklenmedi.
- Sonraki canlı bağlantı fazlarından önce yalnızca okuma yetkili ayrı SQL kullanıcısına geçilmesi önerilir.

## Read-only Stok Önizleme Ekranı

- Bu faz uygulama içinde manuel çalışan Vega Read-only Stok Önizleme ekranını ekler.
- Ekran varsayılan açılışta bağlantı başlatmaz; kullanıcı butona basmadan Vega bağlantısı denenmez.
- Önizleme yalnızca `F0102TBLSTOKLAR` tablosundan en fazla 20 stok kartını read-only olarak gösterir.
- Sonuç sadece geçici ekran state içinde görünür; dosyaya, repoya veya import kaydına yazılmaz.
- Veri yazma, import/senkron, cari/fiş/hareket/tahsilat/ödeme okuma ve ERP arayüzünden veri mutasyonu yoktur.
- `.env.local`, SQL kullanıcı bilgileri, şifre, server/database ve connection string ekranda gösterilmez ve repoya eklenmez.
- `IND` alanı yalnızca teknik ID olarak etiketlenir; kullanıcı karar alanı gibi sunulmaz.
- Sonraki fazlardan önce yalnızca okuma yetkili ayrı SQL kullanıcısına geçilmesi önerilir.

## Read-only Stok Önizleme Güvenlik Teyidi

- Uygulama içi stok önizleme 20 satırla başarılı şekilde test edildi.
- Sonuç geçici ekranda göründü.
- Git çalışma ağacı temiz kaldı.
- Log içinde canlı stok/veritabanı anahtar kelimeleri bulunmadı.
- Dosyaya çıktı alınmadı.
- Import/senkron yapılmadı.
- Veri yazma yapılmadı.
- `.env.local` repoya eklenmedi.

## Stok Önizleme Kullanım İyileştirme

- Read-only stok önizleme ekranına arama kutusu eklendi.
- Arama yalnızca ekranda gelen geçici 20 satır üzerinde çalışır.
- Filtreleme `STOKKODU` ve `MALINCINSI` alanlarında yapılır.
- Kolon başlıkları teknik ID, stok kodu, ürün adı, Vega kod alanları, aday fiyatlar ve KDV grubu olarak daha okunur hale getirildi.
- Fiyat alanları Türkçe para formatına yakın gösterilir; aday/kesinleşmemiş alan olarak kalır.
- Boş veya null alanlar `—` olarak gösterilir.
- Veri kapsamı, SQL sorgusu, bağlantı davranışı ve güvenlik sınırları değişmedi.
- Yeni SQL, otomatik bağlantı, dosyaya çıktı, veri yazma, import/senkron veya cari/fiş/hareket okuma eklenmedi.

## Stok Alan Anlamlandırma ve Doğrulama Hazırlığı

- Bu faz read-only stok önizlemede gelen kolonların nasıl yorumlanacağına dair pasif doğrulama rehberi ekler.
- `STOKKODU` stok kodu, `MALINCINSI` ürün adı / malın cinsi olarak yüksek güvenli alanlardır.
- `IND` yalnızca teknik ID olarak değerlendirilir; kullanıcı karar alanı değildir.
- `KOD1`, `KOD2`, `KOD4` ve `KOD6` anlamı örnek satırlarla doğrulanacak Vega kod alanlarıdır.
- `ALISFIYATI`, `ISKSATISFIYATI2` ve `ISKSATISFIYATI3` aday fiyat alanlarıdır; kesin maliyet veya satış kararı değildir.
- `KDVGRUBU` KDV grubu adayıdır ve muhasebe kontrolü gerektirir.
- Alan yorumları kesin operasyon/muhasebe kararı değildir; Vega ekranı ve örnek satırlarla doğrulandıktan sonra kesinleştirilecektir.
- Canlı stok değerleri repoya yazılmaz; yeni SQL, veri yazma, import/senkron veya kapsam büyütme eklenmez.

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
