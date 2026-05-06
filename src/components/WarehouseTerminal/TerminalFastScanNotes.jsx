import { Zap } from "lucide-react";

const fastScanNotes = [
  "Barkod okutulduktan sonra input tekrar odaklanmalı.",
  "Hızlı okutmalarda her barkod ayrı işlem olarak algılanmalı.",
  "Ürün bulunamazsa mesaj net görünmeli.",
  "Aynı ürün tekrar okutulduğunda son okutulanlar geçmişinde görünmeli.",
  "Sayım sepetine ekleme manuel butonla yapılmalı.",
  "Hızlı okuma sırasında stok miktarı değişmemeli.",
  "Testte okutulan barkod, ürün adı ve stok durumu not alınmalı.",
];

export default function TerminalFastScanNotes() {
  return (
    <section className="table-panel warehouse-terminal-fast-scan-panel">
      <div className="section-heading">
        <Zap size={19} />
        <h2>Hızlı Okuma Test Notları</h2>
      </div>

      <p className="warehouse-terminal-fast-scan-note">Bu alan hızlı okutma testlerinde nelere dikkat edileceğini gösterir. Stokları değiştirmez.</p>

      <ul className="warehouse-terminal-fast-scan-list">
        {fastScanNotes.map((note) => (
          <li key={note}>{note}</li>
        ))}
      </ul>
    </section>
  );
}
