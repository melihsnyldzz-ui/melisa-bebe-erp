import { useState } from "react";
import AppLayout from "./components/Layout/AppLayout.jsx";
import Collections from "./pages/Collections.jsx";
import Customers from "./pages/Customers.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Payments from "./pages/Payments.jsx";
import Products from "./pages/Products.jsx";
import PurchaseSlips from "./pages/PurchaseSlips.jsx";
import Reports from "./pages/Reports.jsx";
import SalesSlips from "./pages/SalesSlips.jsx";
import Settings from "./pages/Settings.jsx";
import StockMovements from "./pages/StockMovements.jsx";
import Suppliers from "./pages/Suppliers.jsx";

export default function App() {
  const [activeModule, setActiveModule] = useState("dashboard");

  const isDashboard = activeModule === "dashboard";
  const isProducts = activeModule === "products";
  const isCustomers = activeModule === "customers";
  const isSuppliers = activeModule === "suppliers";
  const isPurchaseSlips = activeModule === "purchase-slips";
  const isSalesSlips = activeModule === "sales-slips";
  const isCollections = activeModule === "collections";
  const isPayments = activeModule === "payments";
  const isStockMovements = activeModule === "stock-movements";
  const isReports = activeModule === "reports";
  const isSettings = activeModule === "settings";

  return (
    <AppLayout activeModule={activeModule} onModuleChange={setActiveModule}>
      {isDashboard && <Dashboard />}
      {isProducts && <Products />}
      {isCustomers && <Customers />}
      {isSuppliers && <Suppliers />}
      {isPurchaseSlips && <PurchaseSlips />}
      {isSalesSlips && <SalesSlips />}
      {isCollections && <Collections />}
      {isPayments && <Payments />}
      {isStockMovements && <StockMovements />}
      {isReports && <Reports />}
      {isSettings && <Settings />}
      {!isDashboard &&
        !isProducts &&
        !isCustomers &&
        !isSuppliers &&
        !isPurchaseSlips &&
        !isSalesSlips &&
        !isCollections &&
        !isPayments &&
        !isStockMovements &&
        !isReports &&
        !isSettings && <ModulePlaceholder />}
    </AppLayout>
  );
}

function ModulePlaceholder() {
  return (
    <section className="placeholder-page">
      <h1>Bu modül hazırlanıyor</h1>
      <p>ERP modülleri bu yapı üzerine adım adım eklenecek.</p>
    </section>
  );
}
