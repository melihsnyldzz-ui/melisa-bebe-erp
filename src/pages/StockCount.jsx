import StockCountPanel from "../components/StockCount/StockCountPanel.jsx";
import { useErpData } from "../context/ErpDataContext.jsx";

export default function StockCount() {
  const { applyStockCountAdjustment, products } = useErpData();

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
        Not: Sayım farkları raporlanır; stok düzeltme yalnızca açık onaydan sonra stok hareketi oluşturularak uygulanır.
      </p>

      <StockCountPanel products={products} onApplyStockCountAdjustment={applyStockCountAdjustment} />
    </>
  );
}
