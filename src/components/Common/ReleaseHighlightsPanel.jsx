export default function ReleaseHighlightsPanel({
  description = "Sol menüdeki mavi nokta yenilik olan sayfayı gösterir. Bu panel ise sayfa içindeki yeni veya güncellenen bölümleri bulmanı kolaylaştırır.",
  releaseHighlightItems,
  releaseJumpLinks,
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
    </div>
  );
}
