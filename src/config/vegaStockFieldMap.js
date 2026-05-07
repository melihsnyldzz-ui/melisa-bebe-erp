export const vegaStockFieldMap = [
  {
    column: "IND",
    erpMeaning: "Vega stok iç kayıt ID'si / teknik anahtar",
    confidence: "yüksek",
    note: "Teknik eşleştirme için referans alanı adayıdır; kullanıcı kararı için tek başına kullanılmaz.",
  },
  {
    column: "STOKKODU",
    erpMeaning: "Stok kodu",
    confidence: "yüksek",
    note: "ERP stok kartı kodu için ana adaydır.",
  },
  {
    column: "MALINCINSI",
    erpMeaning: "Ürün adı / malın cinsi",
    confidence: "yüksek",
    note: "Ürün adının yönetici ve personel ekranlarında görünen karşılığı olabilir.",
  },
  {
    column: "KOD1",
    erpMeaning: "Sınıflandırma alanı 1",
    confidence: "düşük",
    note: "Marka, grup veya özel kod anlamı gerçek örnek satırlarla doğrulanmalıdır.",
  },
  {
    column: "KOD2",
    erpMeaning: "Sınıflandırma alanı 2",
    confidence: "düşük",
    note: "Kategori veya alt sınıf adayıdır; kesin operasyon kararı değildir.",
  },
  {
    column: "KOD4",
    erpMeaning: "Sınıflandırma alanı 4",
    confidence: "düşük",
    note: "Vega kullanım alışkanlığına göre anlamı değişebilir.",
  },
  {
    column: "KOD6",
    erpMeaning: "Sınıflandırma alanı 6",
    confidence: "düşük",
    note: "Gerçek stok örnekleri incelenmeden kesinleştirilmemelidir.",
  },
  {
    column: "ALISFIYATI",
    erpMeaning: "Alış fiyatı adayı",
    confidence: "orta",
    note: "Maliyet yorumu için adaydır; muhasebe kararı öncesi Vega ekranıyla karşılaştırılmalıdır.",
  },
  {
    column: "ISKSATISFIYATI2",
    erpMeaning: "Satış fiyatı adayı 2",
    confidence: "orta",
    note: "Satış fiyatı seviyesi olabilir; fiyat güncelleme kararı için kullanılmaz.",
  },
  {
    column: "ISKSATISFIYATI3",
    erpMeaning: "Satış fiyatı adayı 3",
    confidence: "orta",
    note: "Alternatif satış fiyatı seviyesi olabilir; gerçek örneklerle doğrulanmalıdır.",
  },
  {
    column: "KDVGRUBU",
    erpMeaning: "KDV grubu adayı",
    confidence: "orta",
    note: "Vergi/muhasebe yorumu için kesin kabul edilmez; Vega ekranı ve muhasebe kontrolü gerekir.",
  },
];

export const vegaStockFieldMapWarning =
  "Bu alan haritası kesin muhasebe/operasyon kararı değildir. Gerçek Vega verisiyle örnek satırlar incelendikten sonra kesinleştirilecektir.";
