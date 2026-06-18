type TopNavProps = {
  onRankingsClick: () => void;
};

export function TopNav({ onRankingsClick }: TopNavProps) {
  return (
    <header className="top-nav">
      <button
        type="button"
        className="brand-mark brand-home-button"
        onClick={onRankingsClick}
        aria-label="Back to rankings"
      >
        <span className="brand-symbol">R</span>
        <div>
          <strong>Rank Intelligence</strong>
          <span>Industry ranking exchange</span>
        </div>
      </button>

      <div className="nav-actions">
        <button
          type="button"
          className="primary-action"
          disabled
          title="Company submission workflow is planned after the data import layer is stable."
        >
          Get Listed
        </button>
      </div>
    </header>
  );
}
