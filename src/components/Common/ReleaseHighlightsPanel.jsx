export default function ReleaseHighlightsPanel({
  description = "Sol menüdeki mavi nokta yenilik olan sayfayı gösterir. Bu panel ise sayfa içindeki yeni veya güncellenen bölümleri bulmanı kolaylaştırır.",
  releaseHighlightItems,
  releaseJumpLinks,
  testChecklist,
  title = "Bu Sürümde Yenilenen Alanlar",
}) {
  return (
    <div className="release-highlights-panel">
      <div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>

      <ul className="release-highlight-list">
        {releaseHighlightItems.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <nav className="release-jump-links" aria-label="Bu sürümde yenilenen alanlara hızlı geçiş">
        {releaseJumpLinks.map((link) => (
          <a href={`#${link.id}`} key={link.id}>
            {link.label}
          </a>
        ))}
      </nav>

      {testChecklist?.length > 0 && (
        <div className="release-visibility-checklist">
          <h3>Yenilik Görünürlük Kontrolü</h3>
          <ul>
            {testChecklist.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
