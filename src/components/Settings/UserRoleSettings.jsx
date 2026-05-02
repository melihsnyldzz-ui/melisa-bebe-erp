import { ShieldCheck } from "lucide-react";

const roles = [
  {
    name: "Yönetici",
    permissions: ["Tüm modüller", "Silme / düzenleme", "Raporlar", "Ayarlar"],
  },
  {
    name: "Muhasebe",
    permissions: ["Ürünler", "Alış Fişleri", "Tahsilatlar", "Ödemeler", "Cari Hesaplar"],
  },
  {
    name: "Satış Personeli",
    permissions: ["Satış Fişleri", "Ürün görüntüleme", "Müşteri görüntüleme"],
  },
  {
    name: "Depo Personeli",
    permissions: ["Stok Hareketleri", "Ürün görüntüleme", "Sevkiyat hazırlık"],
  },
  {
    name: "Patron",
    permissions: ["Ana Panel", "Raporlar", "Cari durum", "Stok durum"],
  },
];

export default function UserRoleSettings() {
  return (
    <section className="table-panel product-table-panel settings-panel settings-roles-panel">
      <div className="section-heading">
        <ShieldCheck size={19} />
        <h2>Kullanıcı Rolleri</h2>
      </div>
      <div className="product-table-scroll">
        <table className="settings-role-table">
          <thead>
            <tr>
              <th>Rol</th>
              <th>Yetkiler</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr key={role.name}>
                <td className="strong-cell">{role.name}</td>
                <td>
                  <div className="permission-badges">
                    {role.permissions.map((permission) => (
                      <span className="permission-badge" key={permission}>
                        {permission}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
