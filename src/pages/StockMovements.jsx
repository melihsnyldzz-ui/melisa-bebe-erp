import { useMemo, useState } from "react";
import { AlertTriangle, ArrowDownLeft, ArrowUpRight, Boxes, Repeat2 } from "lucide-react";
import KpiCard from "../components/Dashboard/KpiCard.jsx";
import StockMovementFilters from "../components/StockMovements/StockMovementFilters.jsx";
import StockMovementTable from "../components/StockMovements/StockMovementTable.jsx";
import { useErpData } from "../context/ErpDataContext.jsx";
import { formatNumber } from "../utils/formatters.js";

const emptyFilters = {
  search: "",
  movementType: "all",
  date: "",
  productId: "all",
};

export default function StockMovements() {
  const { products, stockMovements } = useErpData();
  const [filters, setFilters] = useState(emptyFilters);

  const filteredMovements = useMemo(() => {
    const query = filters.search.trim().toLocaleLowerCase("tr-TR");

    return stockMovements.filter((movement) => {
      const matchesSearch =
        !query ||
        [movement.productName, movement.productCode, movement.barcode, movement.relatedSlipNo, movement.relatedPartyName].some((value) =>
          value.toLocaleLowerCase("tr-TR").includes(query),
        );

      return (
        matchesSearch &&
        (filters.movementType === "all" || movement.movementType === filters.movementType) &&
        (!filters.date || movement.date === filters.date) &&
        (filters.productId === "all" || movement.productId === Number(filters.productId))
      );
    });
  }, [filters, stockMovements]);

  const summaryCards = useMemo(() => {
    const totalIn = filteredMovements.reduce((total, movement) => total + movement.quantityIn, 0);
    const totalOut = filteredMovements.reduce((total, movement) => total + movement.quantityOut, 0);
    const lowStockCount = filteredMovements.filter((movement) => movement.remainingStock <= 10).length;

    return [
      { label: "Toplam Hareket", value: filteredMovements.length.toString(), icon: Repeat2, tone: "dark" },
      { label: "Toplam Giriş", value: formatNumber(totalIn), icon: ArrowDownLeft, tone: "green" },
      { label: "Toplam Çıkış", value: formatNumber(totalOut), icon: ArrowUpRight, tone: "red" },
      { label: "Kritik Seviyeye Yaklaşan Ürün", value: lowStockCount.toString(), icon: AlertTriangle, tone: "amber" },
    ];
  }, [filteredMovements]);

  return (
    <>
      <section className="page-title">
        <div>
          <p>Stok geçmişi</p>
          <h1>Stok Hareketleri</h1>
          <span>Ürün giriş, çıkış ve stok geçmişini fiş bazında takip edin.</span>
        </div>
      </section>

      <section className="kpi-grid product-summary-grid">
        {summaryCards.map((item, index) => (
          <KpiCard item={item} index={index} key={item.label} />
        ))}
      </section>

      <p className="form-note stock-movement-note">
        Not: Gerçek sistemde stok hareketleri alış fişi, satış fişi, iade, sayım ve transfer işlemlerinden otomatik oluşur.
      </p>

      <StockMovementFilters filters={filters} products={products} onChange={setFilters} onReset={() => setFilters(emptyFilters)} />
      <StockMovementTable movements={filteredMovements} />
    </>
  );
}
