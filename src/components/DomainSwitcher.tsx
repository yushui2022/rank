import type { Domain, Track } from "../types/rankings";

type DomainSwitcherProps = {
  domains: Domain[];
  tracks: Track[];
  activeDomainId: string;
  activeTrackId: string;
  onDomainChange: (domainId: Domain["id"]) => void;
  onTrackChange: (trackId: string) => void;
};

export function DomainSwitcher({
  domains,
  tracks,
  activeDomainId,
  activeTrackId,
  onDomainChange,
  onTrackChange,
}: DomainSwitcherProps) {
  const visibleTracks = tracks.filter((track) => track.domainId === activeDomainId);

  return (
    <aside className="domain-switcher">
      <div className="panel-heading">
        <span>Domains</span>
        <strong>Market map</strong>
      </div>

      <div className="domain-buttons">
        {domains.map((domain) => (
          <button
            key={domain.id}
            type="button"
            className={domain.id === activeDomainId ? "is-active" : ""}
            onClick={() => onDomainChange(domain.id)}
          >
            <span>{domain.name}</span>
            <em>{domain.description}</em>
          </button>
        ))}
      </div>

      <div className="track-list" aria-label="Tracks">
        {visibleTracks.map((track) => (
          <button
            key={track.id}
            type="button"
            className={track.id === activeTrackId ? "is-active" : ""}
            onClick={() => onTrackChange(track.id)}
          >
            <span>{track.name}</span>
            <em>{track.label}</em>
          </button>
        ))}
      </div>
    </aside>
  );
}
