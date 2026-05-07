export const readOnlyFailClosedPolicy = {
  policyMode: "passive-fail-closed",
  defaultConnectionState: "Kapalı",
  defaultDbReadState: "Kapalı",
  defaultQueryState: "Yok",
  defaultApiState: "Kapalı",
  defaultWriteState: "Kapalı",
  defaultImportState: "Kapalı",
  rawErrorExposure: "Gizli",
  retryPolicy: "Kapalı",
  firstAttemptLimit: "20 satır",
  firstAttemptScope: "Sadece stok kartı",
};

export const readOnlyFailClosedRules = [
  "Bağlantı parametresi yoksa sistem kapalı kalır.",
  "Read-only kullanıcı manuel doğrulanmadıysa sistem kapalı kalır.",
  "Manuel yedek doğrulanmadıysa sistem kapalı kalır.",
  "İlk kapsam 20 stok kartını aşacaksa sistem kapalı kalır.",
  "Ham hata gizleme politikası hazır değilse sistem kapalı kalır.",
  "Yazma yetkisi şüphesi varsa sistem kapalı kalır.",
  "Başarısızlıkta tekrar deneme yapılmaz; önce rapor hazırlanır.",
];

export const readOnlyBlockedBehaviors = [
  "Canlı Vega bağlantısı",
  "SQL/ODBC bağlantısı",
  "DB okuma",
  "Query üretimi",
  "Query çalıştırma",
  "Connection test",
  "API/backend çağrısı",
  "ERP’ye yazma",
  "Import",
  "Credential saklama",
  "LocalStorage kullanımı",
];
