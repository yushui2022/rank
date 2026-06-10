type TopNavProps = {
  watchlistCount: number;
  shortlistCount: number;
};

const navItems = [
  "Rankings",
  "Trending",
  "New",
  "Categories",
  "Companies",
  "Models",
  "Robotics",
  "Methodology",
  "Sources",
];

export function TopNav({ watchlistCount, shortlistCount }: TopNavProps) {
  return (
    <header className="top-nav">
      <div className="brand-mark">
        <span className="brand-symbol">R</span>
        <div>
          <strong>Rank Intelligence</strong>
          <span>AI · Robotics ranking exchange</span>
        </div>
      </div>

      <nav className="nav-links" aria-label="Primary navigation">
        {navItems.map((item) => (
          <button key={item} type="button">
            {item}
          </button>
        ))}
      </nav>

      <div className="nav-actions">
        <button type="button">Watchlist {watchlistCount}</button>
        <button type="button">Shortlist {shortlistCount}</button>
        <button type="button" className="primary-action">
          Get Listed
        </button>
      </div>
    </header>
  );
}
