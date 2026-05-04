import { PackageCheck } from "lucide-react";
import melisaBabyLogo from "../../assets/melisa-baby-logo.jpg";
import { menuItems } from "../../data/mockData.js";

export default function Sidebar({ activeModule, onModuleChange }) {
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
        {menuItems.map((item) => {
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
