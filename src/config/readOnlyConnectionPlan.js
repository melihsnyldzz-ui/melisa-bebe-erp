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
