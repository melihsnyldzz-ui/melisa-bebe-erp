import { PackageCheck } from "lucide-react";
import melisaBabyLogo from "../../assets/melisa-baby-logo.jpg";
import { useAuth } from "../../context/AuthContext.jsx";
import { menuItems } from "../../data/mockData.js";

const menuPermissions = {
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
  "data-import": "settings.view",
  reports: "reports.view",
  settings: "settings.view",
};

export default function Sidebar({ activeModule, onModuleChange }) {
  const { hasPermission } = useAuth();
  const visibleMenuItems = menuItems.filter((item) => hasPermission(menuPermissions[item.id]));

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-logo">
          <img className="brand-logo-image" src={melisaBabyLogo} alt="Melisa Baby" />
        </div>
        <div>
          <strong>Melisa Bebe ERP</strong>
          <span>Yönetim paneli</span>
        </div>
      </div>
      <nav className="nav-list">
        {visibleMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeModule === item.id;

          return (
            <button className={`nav-item ${isActive ? "active" : ""}`} key={item.id} onClick={() => onModuleChange(item.id)}>
              <Icon size={19} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
      <div className="sidebar-footer">
        <PackageCheck size={20} />
        <span>Stok senkronizasyonu aktif</span>
      </div>
    </aside>
  );
}
