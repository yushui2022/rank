import type { Domain, Track } from "../../types/rankings";

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
  return (
    <aside className="domain-switcher">
      <div className="panel-heading">
        <span>Market map</span>
        <strong>Domains</strong>
      </div>

      <div className="domain-accordion">
        {domains.map((domain) => {
          const isActiveDomain = domain.id === activeDomainId;
          const domainTracks = tracks.filter((track) => track.domainId === domain.id);

          return (
            <div key={domain.id} className="accordion-group">
              <button
                type="button"
                className={`domain-toggle ${isActiveDomain ? "is-active" : ""}`}
                onClick={() => onDomainChange(domain.id)}
              >
                <span className="tick" aria-hidden="true" />
                <span>{domain.name}</span>
                <em>{domain.description}</em>
              </button>

              {isActiveDomain && (
                <div className="track-list nested" aria-label={`Tracks for ${domain.name}`}>
                  {domainTracks.map((track) => (
                    <button
                      key={track.id}
                      type="button"
                      className={track.id === activeTrackId ? "is-active" : ""}
                      onClick={() => onTrackChange(track.id)}
                    >
                      <span className="tick" aria-hidden="true" />
                      <span>{track.name}</span>
                      <span className="count">{track.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
