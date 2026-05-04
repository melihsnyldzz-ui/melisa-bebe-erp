import { Bell, Menu, Search, UserRound } from "lucide-react";
import { ROLE_DEFINITIONS, ROLE_OPTIONS } from "../../config/roles.js";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Topbar() {
  const { currentRole, currentUser, setCurrentRole } = useAuth();

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
            <strong>{currentUser.name}</strong>
            <span>{ROLE_DEFINITIONS[currentRole].label}</span>
          </div>
        </div>
        <label className="role-selector">
          <span>Rol</span>
          <select value={currentRole} onChange={(event) => setCurrentRole(event.target.value)}>
            {ROLE_OPTIONS.map((role) => (
              <option value={role.value} key={role.value}>
                {role.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </header>
  );
}
