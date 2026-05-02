import { useState } from "react";
import AppLayout from "./components/Layout/AppLayout.jsx";
import Dashboard from "./pages/Dashboard.jsx";

export default function App() {
  const [activeModule, setActiveModule] = useState("dashboard");

  const isDashboard = activeModule === "dashboard";

  return (
    <AppLayout activeModule={activeModule} onModuleChange={setActiveModule}>
      {isDashboard ? <Dashboard /> : <ModulePlaceholder />}
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
