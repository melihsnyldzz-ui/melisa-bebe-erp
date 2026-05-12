# Autonomous ERP Development Loop Safety

Bu sistem kullanıcıyı her küçük adımdan çıkarır ve Melisa Bebe ERP geliştirme hattında sıradaki güvenli versiyonu otomatik hazırlamaya çalışır.

Bu tamamen sınırsız otomasyon değildir. Üretim riski olan işlerde durur ve STOP üretir.

Git push, git commit, deploy, canlı DB yazma, migration, secret/API key/token erişimi, `.env` dosyaları, hosting/cPanel/Turhost işlemleri ve ödeme/abonelik/fatura ayarları ayrı insan onayı gerektirir.

`maxVersionsPerRun` başlangıçta 1 kalmalıdır. Bu sınır, tek çalıştırmada yalnızca bir hedef versiyonun ele alınmasını sağlar ve hatalı otomasyonun yayılmasını engeller.

Sistem olgunlaştıkça ve sonuçlar güvenilir hale geldikçe `maxVersionsPerRun` dikkatli şekilde 2 yapılabilir. Bu değişiklikten önce STOP raporları ve build/lint/test sonuçları düzenli kontrol edilmelidir.
