import type { TrackSummary } from "../types/rankings";
import "./track-list.css";

type TrackListProps = {
  title: string;
  description: string;
  tracks: TrackSummary[];
};

export function TrackList({ title, description, tracks }: TrackListProps) {
  return (
    <section className="track-panel">
      <div className="track-panel-head">
        <div>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
      </div>

      <div className="track-grid">
        {tracks.map((track) => (
          <article key={track.id} className="track-card">
            <div className="track-card-head">
              <h4>{track.name}</h4>
              <span>{track.levelLabel}</span>
            </div>
            <p>{track.description}</p>
            <ul>
              {track.examples.map((example) => (
                <li key={example}>{example}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
