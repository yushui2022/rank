import type { AppPageId } from "../types/rankings";

type TopNavProps = {
  activePage: AppPageId;
  onPageChange: (pageId: AppPageId) => void;
};

const navItems: { id: AppPageId; label: string }[] = [
  { id: "rankings", label: "Rankings" },
  { id: "news", label: "News" },
  { id: "downloads", label: "Downloads" },
  { id: "honor-roll", label: "Honor Roll" },
  { id: "sources", label: "Sources" },
];

export function TopNav({
  activePage,
  onPageChange,
}: TopNavProps) {
  return (
    <header className="top-nav">
      <div className="brand-mark">
        <span className="brand-symbol">R</span>
        <div>
          <strong>Rank Intelligence</strong>
          <span>Industry ranking exchange</span>
        </div>
      </div>

      <nav className="nav-links" aria-label="Primary navigation">
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={activePage === item.id ? "is-active" : ""}
            aria-current={activePage === item.id ? "page" : undefined}
            onClick={() => onPageChange(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>

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
