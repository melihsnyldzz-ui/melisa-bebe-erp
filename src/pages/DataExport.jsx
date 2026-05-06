import DataExportPanel from "../components/DataExport/DataExportPanel.jsx";

export default function DataExport() {
  return (
    <>
      <section className="page-title">
        <div>
          <p>Veri dışa aktarımı</p>
          <h1>Excel Dışa Aktarma</h1>
          <span>Ürün, müşteri, tedarikçi, stok hareketi ve rapor verilerini Excel’de açılabilecek CSV formatında dışa aktarın.</span>
        </div>
      </section>

      <DataExportPanel />
    </>
  );
}
