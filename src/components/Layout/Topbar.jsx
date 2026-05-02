import { Bell, Menu, Search, UserRound } from "lucide-react";

export default function Topbar() {
  return (
    <header className="topbar">
      <button className="mobile-menu" aria-label="Menüyü aç">
        <Menu size={22} />
      </button>
      <label className="search-box">
        <Search size={18} />
        <input placeholder="Fiş, müşteri, ürün veya tedarikçi ara" />
      </label>
      <div className="topbar-actions">
        <button className="icon-button" aria-label="Bildirimler">
          <Bell size={19} />
        </button>
        <div className="user-card">
          <div className="avatar">
            <UserRound size={18} />
          </div>
          <div>
            <strong>Melisa Bebe</strong>
            <span>Yönetici</span>
          </div>
        </div>
      </div>
    </header>
  );
}
