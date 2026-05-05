import StockCountPanel from "../components/StockCount/StockCountPanel.jsx";
import { useErpData } from "../context/ErpDataContext.jsx";

export default function StockCount() {
  const { products } = useErpData();

  return (
    <>
      <section className="page-title">
        <div>
          <p>Depo sayımı</p>
          <h1>Barkodlu Stok Sayım</h1>
          <span>Depodaki ürünleri barkodla okutarak sayım listesi oluşturun ve mevcut stok ile farkları kontrol edin.</span>
        </div>
      </section>

      <p className="form-note stock-count-note">
        Not: Bu ekran stokları değiştirmez ve stok hareketi oluşturmaz; yalnızca sayım farklarını raporlamaya hazırlar.
      </p>

      <StockCountPanel products={products} />
    </>
  );
}
