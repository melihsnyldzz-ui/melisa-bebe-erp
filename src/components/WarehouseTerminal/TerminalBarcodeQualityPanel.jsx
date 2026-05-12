function buildQualityWarnings(lastMockBarcode) {
  if (!lastMockBarcode) return ["Henüz barkod test edilmedi."];

  const warnings = [];
  const normalized = lastMockBarcode.normalizedBarcode || "";
  const isEmpty = normalized.length === 0;
  const isDigitsOnly = /^\d+$/.test(normalized);
  const isLengthExpected = normalized.length >= 8 && normalized.length <= 14;

  if (isEmpty) warnings.push("Barkod boş.");
  if (!isEmpty && !isDigitsOnly) warnings.push("Barkod içinde rakam dışı karakter var.");
  if (!isEmpty && !isLengthExpected) warnings.push("Barkod uzunluğu kontrol edilmeli.");
  if (lastMockBarcode.isDuplicate) warnings.push("Aynı barkod hızlı tekrar okutuldu.");
  if (lastMockBarcode.hasLeadingZero) warnings.push("Başındaki sıfır korundu.");
  if (lastMockBarcode.trailingSuffixCleaned) warnings.push("Sonda gelen boşluk/suffix temizlendi.");

  return warnings.length > 0 ? warnings : ["Mock barkod kalite kontrolü geçti."];
}

function getQualityStatus(lastMockBarcode) {
  if (!lastMockBarcode) return "-";

  const normalized = lastMockBarcode.normalizedBarcode || "";
  const isEmpty = normalized.length === 0;
  const isDigitsOnly = /^\d+$/.test(normalized);
  const isLengthExpected = normalized.length >= 8 && normalized.length <= 14;

  if (isEmpty || !isDigitsOnly) return "Dur";
  if (!isLengthExpected || lastMockBarcode.isDuplicate) return "Uyarı";
  return "Geçti";
}

export default function TerminalBarcodeQualityPanel({ lastMockBarcode }) {
  const normalized = lastMockBarcode?.normalizedBarcode || "";
  const isEmpty = normalized.length === 0;
  const isDigitsOnly = normalized ? /^\d+$/.test(normalized) : false;
  const isLengthExpected = normalized.length >= 8 && normalized.length <= 14;
  const warnings = buildQualityWarnings(lastMockBarcode);
  const status = getQualityStatus(lastMockBarcode);

  return (
    <div className="warehouse-mock-barcode-result-grid" id="warehouse-terminal-barcode-quality">
      <article className="warehouse-mock-barcode-card">
        <h3>Barkod Kalite Durumu</h3>
        <dl className="warehouse-mock-barcode-detail-grid">
          <div><dt>Boş mu?</dt><dd>{lastMockBarcode ? (isEmpty ? "Evet" : "Hayır") : "-"}</dd></div>
          <div><dt>Uzunluk 8-14 arası mı?</dt><dd>{lastMockBarcode ? (isLengthExpected ? "Evet" : "Hayır") : "-"}</dd></div>
          <div><dt>Sadece rakam mı?</dt><dd>{lastMockBarcode ? (isDigitsOnly ? "Evet" : "Hayır") : "-"}</dd></div>
          <div><dt>Başında sıfır var mı?</dt><dd>{lastMockBarcode ? (lastMockBarcode.hasLeadingZero ? "Evet" : "Hayır") : "-"}</dd></div>
          <div><dt>Sonda boşluk temizlendi mi?</dt><dd>{lastMockBarcode ? (lastMockBarcode.trailingSuffixCleaned ? "Evet" : "Hayır") : "-"}</dd></div>
          <div><dt>Test sonucu</dt><dd>{status}</dd></div>
        </dl>
      </article>

      <article className="warehouse-mock-barcode-card">
        <h3>Uyarı Mesajları ve Operatör Notu</h3>
        <ul>
          {warnings.map((item) => <li key={item}>{item}</li>)}
        </ul>
        <p>“Dur” sonucu varsa test tekrarlanmalı. “Uyarı” varsa barkod tekrar okutulmalı. “Geçti” ise mock test başarılı sayılır.</p>
      </article>
    </div>
  );
}
