import WarehouseTerminalPanel from "../components/WarehouseTerminal/WarehouseTerminalPanel.jsx";
import { useErpData } from "../context/ErpDataContext.jsx";

export default function WarehouseTerminal() {
  const { products, stockMovements } = useErpData();

  return (
    <>
      <section className="page-title warehouse-terminal-title">
        <div>
          <p>El terminali</p>
          <h1>Depo Terminali Okuma Modu</h1>
          <span>Honeywell veya barkod okuyucu cihazlarda ürün, stok ve son hareket bilgisini sade ekrandan kontrol edin.</span>
        </div>
      </section>

      <WarehouseTerminalPanel products={products} stockMovements={stockMovements} />
    </>
  );
}
