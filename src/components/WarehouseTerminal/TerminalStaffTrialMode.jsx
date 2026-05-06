import { UserCheck } from "lucide-react";

const allowedActions = [
  "Barkod okutabilir.",
  "Ürün kodu, varyant kodu veya model kodu ile arama yapabilir.",
  "Ürün bilgilerini ve stok durumunu görebilir.",
  "Son okutulanlar geçmişini kontrol edebilir.",
  "Sayım sepetine ürün ekleyerek önizleme yapabilir.",
  "Rapor/CSV/JSON önizlemesini kontrol edebilir.",
];

const restrictedActions = [
  "Gerçek stok düzeltmesi yapmamalı.",
  "Satış veya alış fişi oluşturmamalı.",
  "Cari işlem yapmamalı.",
  "Yedekleme veya geri yükleme işlemi denememeli.",
  "Vega ile karşılaştırma yapılmadan canlı veri kabul edilmemeli.",
];

export default function TerminalStaffTrialMode() {
  return (
    <section className="table-panel warehouse-staff-trial-panel">
      <div className="section-heading">
        <UserCheck size={19} />
        <h2>Personel Deneme Modu</h2>
      </div>

      <p className="warehouse-staff-trial-description">
        Bu mod, personelin el terminali ekranını güvenli şekilde denemesi için hazırlanmıştır. Okutma ve önizleme
        yapılabilir; stok, cari veya fiş verileri değişmez.
      </p>

      <div className="warehouse-staff-trial-grid">
        <TrialList title="Personelin Yapabilecekleri" tone="allowed" items={allowedActions} />
        <TrialList title="Personelin Yapmaması Gerekenler" tone="restricted" items={restrictedActions} />
      </div>

      <p className="warehouse-staff-trial-note">
        Bu ekran pilot test içindir. Gerçek stok işlemleri ayrıca onaylı ve yedekli sürümlerde açılacaktır.
      </p>
    </section>
  );
}

function TrialList({ title, tone, items }) {
  return (
    <article className={`warehouse-staff-trial-card ${tone}`}>
      <h3>{title}</h3>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </article>
  );
}
