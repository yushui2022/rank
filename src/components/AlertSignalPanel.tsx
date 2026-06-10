type AlertSignalPanelProps = {
  watchedCount: number;
  shortlistedCount: number;
};

const alertTypes = [
  "Rank change",
  "Score movement",
  "New source",
  "Workbook refresh",
  "Robotics deployment",
];

export function AlertSignalPanel({
  watchedCount,
  shortlistedCount,
}: AlertSignalPanelProps) {
  return (
    <div className="rail-card alert-signal-panel">
      <span>Alerts prototype</span>
      <strong>Signal watch</strong>
      <p>
        No notifications are sent in this build. These event types become alerts
        after persistence and accounts exist.
      </p>
      <div className="alert-signal-counts">
        <div>
          <em>Watchlist</em>
          <b>{watchedCount}</b>
        </div>
        <div>
          <em>Shortlist</em>
          <b>{shortlistedCount}</b>
        </div>
      </div>
      <div className="alert-type-list">
        {alertTypes.map((type) => (
          <span key={type}>{type}</span>
        ))}
      </div>
    </div>
  );
}
