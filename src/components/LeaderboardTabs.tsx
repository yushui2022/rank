import type { LeaderboardView, LeaderboardViewId } from "../types/rankings";

type LeaderboardTabsProps = {
  views: LeaderboardView[];
  activeView: LeaderboardViewId;
  onChange: (viewId: LeaderboardViewId) => void;
};

export function LeaderboardTabs({
  views,
  activeView,
  onChange,
}: LeaderboardTabsProps) {
  return (
    <div className="leaderboard-tabs" role="tablist" aria-label="Leaderboard views">
      {views.map((view) => (
        <button
          key={view.id}
          type="button"
          role="tab"
          aria-selected={view.id === activeView}
          className={view.id === activeView ? "is-active" : ""}
          onClick={() => onChange(view.id)}
          title={view.description}
        >
          {view.label}
        </button>
      ))}
    </div>
  );
}
