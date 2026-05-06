import { AlertTriangle, Database, ShieldCheck } from "lucide-react";
import {
  vegaImportMapping,
  vegaImportSummary,
  vegaStockImportPreviewRows,
} from "../data/vegaImportMapping.js";
import "../vegaImport.css";

const riskRuleMap = Object.fromEntries(vegaImportMapping.riskRules.map((rule) => [rule.id, rule]));

function formatNumber(value) {
  return new Intl.NumberFormat("tr-TR").format(value);
}

export default function VegaImportPreview() {
  const summaryCards = [
    { label: "Firma", value: vegaImportSummary.company },
    { label: "Stok kartı", value: formatNumber(vegaImportSummary.stockCardCount) },
    { label: "Dolu barkod", value: formatNumber(vegaImportSummary.filledBarcodeCount) },
    { label: "Benzersiz barkod", value: formatNumber(vegaImportSummary.uniqueBarcodeCount) },
    { label: "Duplicate barkod riski", value: formatNumber(vegaImportSummary.duplicateBarcodeRisk), tone: "danger" },
    { label: "Çoklu barkodlu stok", value: formatNumber(vegaImportSummary.multiBarcodeStockCount), tone: "warning" },
  ];

  const securityStatusCards = [
    { label: "Canlı Vega bağlantısı", value: "Kapalı" },
    { label: "SQL/ODBC okuma", value: "Kapalı" },
    { label: "ERP’ye yazma", value: "Kapalı" },
    { label: "Import işlemi", value: "Kapalı" },
  ];

  return (
    <>
      <section className="page-title vega-import-title">
        <div>
          <p>Read-only Demo / Preview</p>
          <h1>Vega Import Önizleme</h1>
          <span>Vega yedek analizine göre stok önizleme eşleştirme ve risk kontrol ekranı.</span>
        </div>
      </section>

      <section className="vega-import-warning-panel section-updated-highlight" id="vega-import-preview-panel">
        <AlertTriangle size={18} />
        <div>
          <strong>Import Kilidi Aktif</strong>
          <p>Bu ekran sadece mock önizleme ve mapping kontrolü içindir. Canlı Vega bağlantısı kurmaz, SQL/ODBC okuması yapmaz, ERP’ye kayıt yazmaz ve import başlatmaz.</p>
        </div>
      </section>

      <section className="vega-import-summary-grid">
        {securityStatusCards.map((card) => (
          <div className="vega-import-summary-card warning" key={card.label}>
            <span>{card.label}</span>
            <strong>{card.value}</strong>
          </div>
        ))}
      </section>

      <section className="vega-import-summary-grid">
        {summaryCards.map((card) => (
          <div className={`vega-import-summary-card ${card.tone || ""}`} key={card.label}>
            <span>{card.label}</span>
            <strong>{card.value}</strong>
          </div>
        ))}
      </section>

      <section className="vega-import-map-panel">
        <div className="vega-import-map-header">
          <Database size={18} />
          <div>
            <h2>Doğrulanmış Vega Kaynak Bilgisi</h2>
            <p>Bu bilgiler merkezi mapping dosyasından okunur; bu sürümde SQL/ODBC bağlantısı, DB okuma ve canlı veri çekme işlemi yapılmaz.</p>
          </div>
        </div>
        <div className="vega-import-map-grid">
          <div><span>Firma</span><strong>F0102 · {vegaImportMapping.companyPrefixes.F0102}</strong></div>
          <div><span>Muhasebe</span><strong>F0103 · {vegaImportMapping.companyPrefixes.F0103}</strong></div>
          <div><span>Fatura</span><strong>F0104 · {vegaImportMapping.companyPrefixes.F0104}</strong></div>
          <div><span>Dönem</span><strong>D0007 · {vegaImportMapping.periods.D0007}</strong></div>
          <div><span>Stok tablosu</span><strong>{vegaImportMapping.stockMapping.sourceTable}</strong></div>
          <div><span>Barkod / Birim tablosu</span><strong>{vegaImportMapping.barcodeMapping.sourceTable}</strong></div>
          <div><span>Barkod join</span><strong>{vegaImportMapping.barcodeMapping.join}</strong></div>
          <div><span>Müşteri cari</span><strong>{vegaImportMapping.customerMapping.sourceTable}</strong></div>
          <div><span>Tedarikçi cari</span><strong>{vegaImportMapping.supplierMapping.sourceTable}</strong></div>
          <div><span>Cari bakiye kuralı</span><strong>Hareketlerden hesaplanacak</strong></div>
        </div>
      </section>

      <section className="vega-import-tabs">
        <button className="active" type="button">Stok Önizleme</button>
        <button type="button" disabled>Müşteri Cari · Kapalı · Sonra</button>
        <button type="button" disabled>Tedarikçi Cari · Kapalı · Sonra</button>
      </section>

      <section className="vega-import-table-panel">
        <div className="vega-import-table-heading">
          <div>
            <h2>Stok Önizleme</h2>
            <p>Bu tablo mock veriyle çalışan pasif önizlemedir. Bu sürümde SQL okuma, canlı veri çekme veya kayıt yazma işlemi yoktur.</p>
          </div>
          <span><ShieldCheck size={14} /> Pasif önizleme · Gerçek import yok</span>
        </div>

        <div className="vega-import-table-wrap">
          <table className="vega-import-table">
            <thead>
              <tr>
                <th>Stok kodu</th>
                <th>Ürün adı</th>
                <th>Marka</th>
                <th>Kategori</th>
                <th>Beden/Yaş</th>
                <th>Sezon/Malzeme</th>
                <th>Barkod</th>
                <th>Birim</th>
                <th>Alış fiyat aralığı</th>
                <th>Satış fiyat aralığı</th>
                <th>KDV grubu</th>
                <th>Aktif/Pasif tahmini</th>
                <th>Uyarılar</th>
              </tr>
            </thead>
            <tbody>
              {vegaStockImportPreviewRows.map((row) => (
                <tr key={row.id}>
                  <td>{row.stockCode || "Eksik"}</td>
                  <td>{row.productName || "Eksik"}</td>
                  <td>{row.brand || "-"}</td>
                  <td>{row.category || "-"}</td>
                  <td>{row.sizeAge || "-"}</td>
                  <td>{row.seasonMaterial || "-"}</td>
                  <td>{row.barcode || "Barkodsuz"}</td>
                  <td>{row.unit || "-"}</td>
                  <td>{row.purchasePriceRange || "-"}</td>
                  <td>{row.salePriceRange || "-"}</td>
                  <td>{row.taxGroup || "-"}</td>
                  <td>{row.activePassiveEstimate || "Kural bekliyor"}</td>
                  <td>
                    <div className="vega-risk-chip-list">
                      {row.warnings.length === 0 && <span className="vega-risk-chip low">Risk yok</span>}
                      {row.warnings.map((warningId) => {
                        const rule = riskRuleMap[warningId];
                        return (
                          <span className={`vega-risk-chip ${rule?.severity || "medium"}`} key={warningId}>
                            {rule?.label || warningId}
                          </span>
                        );
                      })}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="vega-import-risk-panel">
        <h2>Risk Kuralları</h2>
        <p>Bu kurallar yalnızca ön kontrol içindir; kayıt oluşturmaz, veriyi değiştirmez ve import başlatmaz.</p>
        <div className="vega-import-risk-grid">
          {vegaImportMapping.riskRules.map((rule) => (
            <span className={`vega-risk-chip ${rule.severity}`} key={rule.id}>{rule.label}</span>
          ))}
        </div>
      </section>

      <section className="vega-transition-gate-panel">
        <h2>Read-only Geçiş Kapısı</h2>
        <p>Gerçek Vega read-only denemesi bu ekrandan başlamaz. Önce ayrı sürümde manuel yedek, minimum yetkili kullanıcı, satır limiti, timeout ve yalnızca okuma sorgusu doğrulanmalıdır.</p>
        <p className="vega-transition-gate-note">Bu liste yalnızca kontrol rehberidir; bu ekrandan bağlantı kurulmaz, sorgu çalıştırılmaz ve işlem başlatılmaz.</p>
        <div className="vega-transition-gate-grid">
          <div className="vega-transition-gate-row"><strong>Manuel yedek doğrulandı mı?</strong><span>Bekliyor</span></div>
          <div className="vega-transition-gate-row"><strong>Minimum yetkili read-only kullanıcı hazır mı?</strong><span>Bekliyor</span></div>
          <div className="vega-transition-gate-row"><strong>Satır limiti belirlendi mi?</strong><span>Bekliyor</span></div>
          <div className="vega-transition-gate-row"><strong>Timeout ve retry kapalı politikası hazır mı?</strong><span>Bekliyor</span></div>
          <div className="vega-transition-gate-row"><strong>İlk sorgu sadece stok kartı okuyacak mı?</strong><span>Bekliyor</span></div>
          <div className="vega-transition-gate-row"><strong>Yazma yetkisi kapalı mı?</strong><span>Bekliyor</span></div>
          <div className="vega-transition-gate-row"><strong>Test canlı Vega dışında izole edilecek mi?</strong><span>Bekliyor</span></div>
        </div>
        <div className="vega-transition-gate-note">
          <strong>Sonraki Aşama Sınırı</strong>
          <span>Bu faz gerçek Vega bağlantısı başlatmaz. Sonraki aşamada önce yalnızca bağlantı parametreleri, read-only kullanıcı bilgisi, 20 satır limiti, timeout ve ham hata gizleme politikası ayrı güvenli sürümde hazırlanacaktır.</span>
        </div>
      </section>

      <section className="vega-transition-gate-panel">
        <h2>Read-only Bağlantı Parametreleri Hazırlığı</h2>
        <p>Bu alan yalnızca ilerideki read-only bağlantı için gereken bilgileri gösterir. Bu sürümde bağlantı kurulmaz, SQL/ODBC açılmaz, DB okunmaz ve sorgu çalıştırılmaz.</p>
        <div className="vega-transition-gate-grid">
          <div className="vega-transition-gate-row"><strong>Bağlantı modu</strong><span>Kapalı / Hazırlık</span></div>
          <div className="vega-transition-gate-row"><strong>Kullanıcı tipi</strong><span>Minimum yetkili read-only kullanıcı hazırlanacak</span></div>
          <div className="vega-transition-gate-row"><strong>Satır limiti</strong><span>İlk deneme için 20 satır</span></div>
          <div className="vega-transition-gate-row"><strong>Timeout</strong><span>3000 ms hedef</span></div>
          <div className="vega-transition-gate-row"><strong>Retry politikası</strong><span>Kapalı</span></div>
          <div className="vega-transition-gate-row"><strong>Ham hata gösterimi</strong><span>Gizlenecek</span></div>
          <div className="vega-transition-gate-row"><strong>İlk kapsam</strong><span>Sadece stok kartı okuma taslağı</span></div>
        </div>
        <div className="vega-transition-gate-note">
          <strong>İlk Sorgu Kapsamı Taslak Notu</strong>
          <span>İlk gerçek read-only testte hedef yalnızca stok kartlarını sınırlı sayıda okumaktır. Cari, fiş, hareket, ödeme, tahsilat ve import işlemleri bu kapsamda değildir.</span>
        </div>
        <div className="vega-transition-gate-note">
          <strong>Operatör Hazırlık Rehberi</strong>
          <span>İlk gerçek read-only deneme öncesinde operatör yalnızca hazırlık bilgilerini kontrol eder. Bu ekranda bağlantı testi, sorgu çalıştırma veya veri aktarımı yapılmaz.</span>
        </div>
        <div className="vega-transition-gate-grid">
          <div className="vega-transition-gate-row"><strong>Manuel yedek</strong><span>Testten önce manuel yedek alındığını doğrula.</span></div>
          <div className="vega-transition-gate-row"><strong>Read-only yetki</strong><span>Kullanıcının sadece okuma yetkisi olduğunu doğrula.</span></div>
          <div className="vega-transition-gate-row"><strong>20 stok kartı</strong><span>İlk denemede yalnızca 20 stok kartı okunacağını doğrula.</span></div>
          <div className="vega-transition-gate-row"><strong>Ham hata</strong><span>Ham hata mesajlarının kullanıcıya gösterilmeyeceğini doğrula.</span></div>
          <div className="vega-transition-gate-row"><strong>Manuel karşılaştırma</strong><span>Test sonucunun Vega ekranıyla manuel karşılaştırılacağını doğrula.</span></div>
          <div className="vega-transition-gate-row"><strong>Hata notu</strong><span>Hata görülürse ekran adı, işlem ve hata notu hazırlanacağını doğrula.</span></div>
        </div>
        <div className="vega-transition-gate-note">
          <strong>Güvenli Deneme Öncesi Uyarı</strong>
          <span>Bu hazırlık tamamlanmadan gerçek read-only bağlantı denemesi yapılmamalıdır. İlk gerçek deneme ayrı sürümde, sınırlı kapsamla ve manuel yedek doğrulandıktan sonra ele alınacaktır.</span>
        </div>
      </section>

      <section className="vega-transition-gate-panel">
        <h2>Final Güvenlik Matrisi</h2>
        <p>İlk gerçek read-only denemeye geçmeden önce aşağıdaki güvenlik şartları ayrı sürümde tekrar doğrulanmalıdır. Bu panel yalnızca rehberdir; bağlantı kurmaz, sorgu çalıştırmaz ve veri yazmaz.</p>
        <div className="vega-transition-gate-grid">
          <div className="vega-transition-gate-row"><strong>Manuel yedek</strong><span>Zorunlu</span></div>
          <div className="vega-transition-gate-row"><strong>Kullanıcı yetkisi</strong><span>Sadece read-only</span></div>
          <div className="vega-transition-gate-row"><strong>İlk sorgu</strong><span>Sadece stok kartları</span></div>
          <div className="vega-transition-gate-row"><strong>Satır limiti</strong><span>20 satır</span></div>
          <div className="vega-transition-gate-row"><strong>Timeout</strong><span>3000 ms</span></div>
          <div className="vega-transition-gate-row"><strong>Retry</strong><span>Kapalı</span></div>
          <div className="vega-transition-gate-row"><strong>Ham hata mesajı</strong><span>Gizli</span></div>
          <div className="vega-transition-gate-row"><strong>ERP’ye yazma</strong><span>Kapalı</span></div>
          <div className="vega-transition-gate-row"><strong>Import</strong><span>Kapalı</span></div>
          <div className="vega-transition-gate-row"><strong>Karşılaştırma</strong><span>Vega ekranı ile manuel</span></div>
        </div>
        <div className="vega-transition-gate-note">
          <strong>Kapsam Dışı</strong>
          <span>İlk deneme cari, fiş, hareket, ödeme, tahsilat, stok mutasyonu, import ve otomatik aktarım işlemlerini kapsamaz.</span>
        </div>
      </section>

      <section className="vega-transition-gate-panel">
        <h2>İlk Deneme Teknik Kontrolü</h2>
        <p>Bu alan ilk gerçek read-only denemeye geçmeden önce teknik şartların yalnızca kontrol edilmesi için hazırlanmıştır. Bu sürümde bağlantı kurulmaz, sorgu hazırlanmaz, sorgu çalıştırılmaz ve veri yazılmaz.</p>
        <div className="vega-transition-gate-grid">
          <div className="vega-transition-gate-row"><strong>Bağlantı durumu</strong><span>Kurulmadı</span></div>
          <div className="vega-transition-gate-row"><strong>SQL/ODBC durumu</strong><span>Açılmadı</span></div>
          <div className="vega-transition-gate-row"><strong>DB okuma</strong><span>Yapılmadı</span></div>
          <div className="vega-transition-gate-row"><strong>Query taslağı</strong><span>Hazırlanmadı</span></div>
          <div className="vega-transition-gate-row"><strong>İlk test kapsamı</strong><span>Sadece stok kartları olacak</span></div>
          <div className="vega-transition-gate-row"><strong>Veri yazma</strong><span>Kapalı</span></div>
          <div className="vega-transition-gate-row"><strong>Import</strong><span>Kapalı</span></div>
          <div className="vega-transition-gate-row"><strong>Hata politikası</strong><span>Ham hata kullanıcıya gösterilmeyecek</span></div>
        </div>
        <div className="vega-transition-gate-note">
          <strong>Güvenli İlk Deneme Notu</strong>
          <span>Gerçek ilk deneme ayrı sürümde, manuel yedek doğrulandıktan ve read-only kullanıcı yetkisi kesinleştirildikten sonra ele alınacaktır.</span>
        </div>
      </section>
    </>
  );
}
