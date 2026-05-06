import DataImportPanel from "../components/DataImport/DataImportPanel.jsx";
import ImportTemplateDownloadPanel from "../components/DataImport/ImportTemplateDownloadPanel.jsx";
import VegaImportPreview from "./VegaImportPreview.jsx";

export default function DataImport() {
  return (
    <>
      <VegaImportPreview />

      <section className="page-title">
        <div>
          <p>Veri aktarımı</p>
          <h1>Excel İçe Aktarma</h1>
          <span>Ürün, müşteri ve tedarikçi listelerini ERP’ye aktarmadan önce kontrol edin ve kolonları eşleştirin.</span>
        </div>
      </section>

      <ImportTemplateDownloadPanel />
      <DataImportPanel />
    </>
  );
}
