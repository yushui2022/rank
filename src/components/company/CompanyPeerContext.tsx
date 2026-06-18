import type { Track } from "../../types/rankings";
import type { ScoredRecord } from "../../utils/rankingLogic";
import { CompanyLogo } from "./CompanyLogo";

type CompanyPeerContextProps = {
  track: Track;
  peers: ScoredRecord[];
  onOpenCompany: (entityId: string, trackId: string) => void;
};

export function CompanyPeerContext({
  track,
  peers,
  onOpenCompany,
}: CompanyPeerContextProps) {
  return (
    <article className="company-section">
      <div className="company-section-head compact">
        <span>Peer context</span>
        <strong>{track.name}</strong>
      </div>
      <div className="company-peer-list">
        {peers.map((peer) => (
          <button
            key={`${peer.row.trackId}-${peer.entity.id}`}
            type="button"
            onClick={() => onOpenCompany(peer.entity.id, peer.row.trackId)}
          >
            <span>#{peer.row.rank}</span>
            <CompanyLogo entity={peer.entity} />
            <strong>{peer.entity.name}</strong>
            <em>{peer.row.score.toFixed(1)}</em>
          </button>
        ))}
      </div>
    </article>
  );
}
