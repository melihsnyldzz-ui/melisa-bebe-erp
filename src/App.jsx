import { useEffect, useMemo, useState } from "react";
import AppLayout from "./components/Layout/AppLayout.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import Collections from "./pages/Collections.jsx";
import Customers from "./pages/Customers.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Payments from "./pages/Payments.jsx";
import Products from "./pages/Products.jsx";
import PurchaseSlips from "./pages/PurchaseSlips.jsx";
import Reports from "./pages/Reports.jsx";
import SalesSlips from "./pages/SalesSlips.jsx";
import Settings from "./pages/Settings.jsx";
import StockCount from "./pages/StockCount.jsx";
import StockMovements from "./pages/StockMovements.jsx";
import Suppliers from "./pages/Suppliers.jsx";
import PurchaseSlipWindow from "./pages/windows/PurchaseSlipWindow.jsx";
import SalesSlipWindow from "./pages/windows/SalesSlipWindow.jsx";

export default function App() {
  const { hasPermission } = useAuth();
  const [activeModule, setActiveModule] = useState("dashboard");
  const windowType = new URLSearchParams(window.location.search).get("window");
  const modulePermissions = useMemo(
    () => ({
      dashboard: "dashboard.view",
      products: "products.view",
      customers: "customers.view",
      suppliers: "suppliers.view",
      "purchase-slips": "purchaseSlips.view",
      "sales-slips": "salesSlips.view",
      collections: "collections.view",
      payments: "payments.view",
      "stock-movements": "stockMovements.view",
      "stock-count": "stockMovements.view",
      reports: "reports.view",
      settings: "settings.view",
    }),
    [],
  );

  useEffect(() => {
    const permission = modulePermissions[activeModule];
    if (permission && !hasPermission(permission)) {
      setActiveModule("dashboard");
    }
  }, [activeModule, hasPermission, modulePermissions]);

  if (windowType === "purchase-slip") {
    return <PurchaseSlipWindow />;
  }

  if (windowType === "sales-slip") {
    return <SalesSlipWindow />;
  }

  const isDashboard = activeModule === "dashboard";
  const isProducts = activeModule === "products";
  const isCustomers = activeModule === "customers";
  const isSuppliers = activeModule === "suppliers";
  const isPurchaseSlips = activeModule === "purchase-slips";
  const isSalesSlips = activeModule === "sales-slips";
  const isCollections = activeModule === "collections";
  const isPayments = activeModule === "payments";
  const isStockMovements = activeModule === "stock-movements";
  const isStockCount = activeModule === "stock-count";
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
      {isStockCount && <StockCount />}
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
        !isStockCount &&
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
