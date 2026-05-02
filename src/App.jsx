import { useState } from "react";
import AppLayout from "./components/Layout/AppLayout.jsx";
import Customers from "./pages/Customers.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Products from "./pages/Products.jsx";
import PurchaseSlips from "./pages/PurchaseSlips.jsx";
import Suppliers from "./pages/Suppliers.jsx";

export default function App() {
  const [activeModule, setActiveModule] = useState("dashboard");

  const isDashboard = activeModule === "dashboard";
  const isProducts = activeModule === "products";
  const isCustomers = activeModule === "customers";
  const isSuppliers = activeModule === "suppliers";
  const isPurchaseSlips = activeModule === "purchase-slips";

  return (
    <AppLayout activeModule={activeModule} onModuleChange={setActiveModule}>
      {isDashboard && <Dashboard />}
      {isProducts && <Products />}
      {isCustomers && <Customers />}
      {isSuppliers && <Suppliers />}
      {isPurchaseSlips && <PurchaseSlips />}
      {!isDashboard && !isProducts && !isCustomers && !isSuppliers && !isPurchaseSlips && <ModulePlaceholder />}
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
