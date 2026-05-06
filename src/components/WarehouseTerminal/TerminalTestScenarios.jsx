import { ClipboardList } from "lucide-react";

const testScenarios = [
  {
    title: "Barkod ile tam eşleşme",
    scan: "Ürün barkodunu okutun.",
    expected: "Tek ürün bilgi kartı açılmalı.",
    note: "Barkod, ekran adı ve görünen ürün bilgisini not alın.",
  },
  {
    title: "Ürün kodu ile tam eşleşme",
    scan: "Ürün kodunu yazıp okutun.",
    expected: "Kodla eşleşen ürün doğrudan açılmalı.",
    note: "Kod doğruyken ürün açılmıyorsa ürün kodunu not alın.",
  },
  {
    title: "Varyant kodu ile tam eşleşme",
    scan: "Varyant kodunu okutun.",
    expected: "Beden/renk varyantı doğru ürün kartında görünmeli.",
    note: "Açılan ürünün beden ve rengini not alın.",
  },
  {
    title: "Model kodu ile tam eşleşme",
    scan: "Model kodunu okutun.",
    expected: "Model koduyla eşleşen ürün bilgisi bulunmalı.",
    note: "Birden fazla sonuç çıkarsa sonuç sayısını not alın.",
  },
  {
    title: "Kısmi arama ile birden fazla ürün sonucu",
    scan: "Ürün adının, barkodun veya kodun bir bölümünü yazın.",
    expected: "Eşleşen Ürünler listesi en fazla 10 sonuçla görünmeli.",
    note: "Liste boşsa arama değerini ve beklenen ürünü not alın.",
  },
  {
    title: "Bulunamayan barkod",
    scan: "Sistemde olmayan bir barkod okutun.",
    expected: "Ürün bulunamadı mesajı görünmeli.",
    note: "Okutulan barkodu ve hata mesajını not alın.",
  },
  {
    title: "Stok yok ürünü",
    scan: "Stok miktarı 0 olan ürünü okutun.",
    expected: "Stok yok durumu belirgin görünmeli.",
    note: "Ürün kodu ve stok mesajını not alın.",
  },
  {
    title: "Kritik stok ürünü",
    scan: "Stok miktarı kritik seviyeye yakın ürünü okutun.",
    expected: "Kritik stok uyarısı görünmeli.",
    note: "Mevcut stok ve kritik stok seviyesini not alın.",
  },
  {
    title: "Negatif stok uyarısı",
    scan: "Negatif stoklu test ürünü varsa okutun.",
    expected: "Negatif stok durumu uyarı olarak görünmeli.",
    note: "Negatif stok değeri ve ürün bilgisini not alın.",
  },
  {
    title: "Pasif ürün kontrolü",
    scan: "Pasif ürün varsa barkod veya kodla okutun.",
    expected: "Pasif ürün durumu ürün kartında görünmeli.",
    note: "Pasif ürün görünmüyorsa ürün kodunu not alın.",
  },
];

export default function TerminalTestScenarios() {
  return (
    <section className="table-panel warehouse-terminal-test-panel">
      <div className="section-heading">
        <ClipboardList size={19} />
        <h2>Barkod Test Senaryoları</h2>
      </div>

      <p className="warehouse-terminal-test-note">Bu test listesi sadece kontrol amaçlıdır. Stokları değiştirmez.</p>

      <div className="warehouse-terminal-test-grid">
        {testScenarios.map((scenario) => (
          <article className="warehouse-terminal-test-card" key={scenario.title}>
            <h3>{scenario.title}</h3>
            <dl>
              <div>
                <dt>Ne okutulacak?</dt>
                <dd>{scenario.scan}</dd>
              </div>
              <div>
                <dt>Beklenen sonuç ne?</dt>
                <dd>{scenario.expected}</dd>
              </div>
              <div>
                <dt>Hata olursa ne not alınacak?</dt>
                <dd>{scenario.note}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}
