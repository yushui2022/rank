import type { CategorySummary } from "../types/rankings";
import "./category-panel.css";

type CategoryPanelProps = {
  items: CategorySummary[];
  activeId: string;
};

export function CategoryPanel({ items, activeId }: CategoryPanelProps) {
  return (
    <nav className="category-panel" aria-label="一级分类">
      {items.map((item) => (
        <div
          key={item.id}
          className={`category-card${item.id === activeId ? " is-active" : ""}`}
        >
          <div>
            <div className="category-name">{item.name}</div>
            <div className="category-desc">{item.description}</div>
          </div>
          <div className="category-count">{item.tracks.length}</div>
        </div>
      ))}
    </nav>
  );
}
