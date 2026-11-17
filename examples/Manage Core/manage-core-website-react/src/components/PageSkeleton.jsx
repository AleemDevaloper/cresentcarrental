/** Route-level loading placeholder — shown during client navigation while chunks load. */
export default function PageSkeleton() {
  return (
    <div className="mc-sk" aria-busy="true" aria-label="Loading page">
      <div className="mc-container">
        <span className="mc-sk-line mc-sk-w20" style={{ marginBottom: 18 }} />
        <span className="mc-sk-line mc-sk-w60 mc-sk-hlg" style={{ marginBottom: 14 }} />
        <span className="mc-sk-line mc-sk-w80" style={{ marginBottom: 8 }} />
        <span className="mc-sk-line mc-sk-w70" style={{ marginBottom: 32 }} />
        <div className="mc-sk-grid">
          <span className="mc-sk-block" />
          <span className="mc-sk-block" />
          <span className="mc-sk-block" />
        </div>
      </div>
    </div>
  );
}
