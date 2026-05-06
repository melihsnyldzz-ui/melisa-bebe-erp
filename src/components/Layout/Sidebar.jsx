import { PackageCheck } from "lucide-react";
import melisaBabyLogo from "../../assets/melisa-baby-logo.jpg";
import { APP_STAGE, APP_VERSION } from "../../config/appVersion.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { menuItems, updatedMenuItemIds } from "../../data/mockData.js";

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
  "warehouse-terminal": "stockMovements.view",
  "vega-stock-trial": "settings.view",
  "vega-import-preview": "settings.view",
  "data-import": "settings.view",
  "data-export": "reports.view",
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
          <span className="sidebar-version-badge" title={`${APP_VERSION} · ${APP_STAGE}`} aria-label={`${APP_VERSION} · ${APP_STAGE}`}>
            <strong>{APP_VERSION}</strong>
            <small>Güncel sürüm</small>
          </span>
        </div>
      </div>
      <nav className="nav-list">
        {visibleMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeModule === item.id;
          const hasUpdate = updatedMenuItemIds.includes(item.id);

          return (
            <button className={`nav-item ${isActive ? "active" : ""}`} key={item.id} onClick={() => onModuleChange(item.id)}>
              <Icon size={19} />
              <span>{item.label}</span>
              {hasUpdate && <i className="nav-update-dot" title="Bu sayfada yeni özellik var" aria-label="Bu sayfada yeni özellik var" />}
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
