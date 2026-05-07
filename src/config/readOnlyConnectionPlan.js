export const readOnlyConnectionPlan = {
  mode: "disabled-passive-plan",
  connectionStatus: "Kapalı",
  sqlOdbcStatus: "Kapalı",
  dbReadStatus: "Kapalı",
  queryStatus: "Yok",
  apiStatus: "Kapalı",
  firstScope: "Sadece stok kartı",
  firstLimit: "20 satır",
  timeoutTarget: "3000 ms",
  retryPolicy: "Kapalı",
  rawErrorPolicy: "Gizli",
  writePolicy: "Kapalı",
  importPolicy: "Kapalı",
};

export const readOnlyConnectionLocks = [
  { label: "Canlı Vega bağlantısı", value: "Kapalı" },
  { label: "SQL/ODBC", value: "Kapalı" },
  { label: "DB okuma", value: "Kapalı" },
  { label: "Query", value: "Yok" },
  { label: "Connection test", value: "Kapalı" },
  { label: "API/backend", value: "Kapalı" },
  { label: "ERP’ye yazma", value: "Kapalı" },
  { label: "Import", value: "Kapalı" },
];

export const readOnlyFirstScopeRules = [
  "İlk kapsam sadece stok kartı olacaktır.",
  "İlk deneme en fazla 20 satır ile sınırlanacaktır.",
  "Cari, fiş, hareket, tahsilat ve ödeme kapsam dışıdır.",
  "Ham hata kullanıcıya gösterilmeyecektir.",
  "Başarısızlıkta tekrar deneme yapılmadan önce rapor hazırlanacaktır.",
];

export const readOnlyOperatorChecklist = [
  { role: "Operatör", item: "Manuel yedek alındığını yetkili kişiden teyit eder.", status: "Manuel kontrol" },
  { role: "Teknik sorumlu", item: "Read-only kullanıcı yetkisinin sadece okuma olduğunu doğrular.", status: "Manuel kontrol" },
  { role: "Patron / yönetici", item: "İlk testin sadece 20 stok kartı ile sınırlı olduğunu onaylar.", status: "Manuel karar" },
  { role: "Operatör", item: "Ham hata mesajlarının kullanıcıya gösterilmeyeceğini kontrol eder.", status: "Manuel kontrol" },
  { role: "Teknik sorumlu", item: "Timeout hedefinin 3000 ms olduğunu not eder.", status: "Manuel kontrol" },
  { role: "Patron / yönetici", item: "Başarısızlık halinde tekrar deneme yapılmadan rapor hazırlanacağını kabul eder.", status: "Manuel karar" },
];

export const readOnlyNextPhaseBoundaries = [
  "Sonraki faz yalnızca küçük read-only bağlantı denemesi olabilir.",
  "İlk deneme sadece stok kartı okuma ile sınırlı kalacaktır.",
  "İlk deneme en fazla 20 satır ile yapılacaktır.",
  "Cari, fiş, hareket, tahsilat, ödeme ve import kapsam dışı kalacaktır.",
  "Veri yazma ve import kapalı kalacaktır.",
];

export const readOnlyPreConnectionCleanupNotes = [
  "Bu dosya yalnızca pasif metadata içerir.",
  "Gerçek bağlantı bilgisi, credential veya query içermez.",
  "İlk gerçek bağlantı ayrı küçük onaylı fazda ele alınacaktır.",
];

export const readOnlyFailClosedPreparationNotes = [
  "İlk gerçek bağlantı fazı açılana kadar sistem kapalı kalır.",
  "Fail-closed prensibi gereği eksik şart varsa bağlantı denenmez.",
  "Bu hazırlık dosyaları gerçek bağlantı davranışı içermez.",
];

export const readOnlyEnvironmentPreparationItems = [
  { label: "SQL Server / sunucu bilgisi", owner: "Teknik sorumlu", status: "Manuel tespit edilecek" },
  { label: "Veritabanı adı", owner: "Teknik sorumlu", status: "Manuel tespit edilecek" },
  { label: "Read-only kullanıcı", owner: "Teknik sorumlu", status: "Sadece okuma yetkisiyle hazırlanacak" },
  { label: "Manuel yedek", owner: "Operatör / teknik sorumlu", status: "Testten önce doğrulanacak" },
  { label: "Test bilgisayarı", owner: "Teknik sorumlu", status: "Manuel belirlenecek" },
  { label: "Test ortamı", owner: "Patron / yönetici", status: "Canlı dışı/kopya ortam tercih edilecek" },
  { label: "Test zamanı", owner: "Patron / yönetici", status: "Riskin düşük olduğu saat seçilecek" },
  { label: "Hata notu sorumlusu", owner: "Operatör", status: "Test sırasında not alacak" },
];

export const readOnlyEnvironmentDecisionNotes = [
  "Bu ekranda gerçek bağlantı bilgisi girilmez.",
  "Sunucu, DB adı, kullanıcı adı veya şifre bu dosyada tutulmaz.",
  "Read-only kullanıcı yetkisi manuel olarak doğrulanacaktır.",
  "İlk deneme mümkünse canlı dışı/kopya ortamda yapılmalıdır.",
  "Gerçek bağlantı ayrı küçük ve onaylı fazda ele alınacaktır.",
];
