import type { Source } from "../types/rankings";
import { Badge } from "./Badge";

type SourceLedgerProps = {
  sources: Source[];
};

export function SourceLedger({ sources }: SourceLedgerProps) {
  return (
    <section className="source-ledger">
      <div className="panel-title-row">
        <div>
          <span>Sources</span>
          <h2>Evidence ledger</h2>
        </div>
        <p>{sources.length} source records</p>
      </div>

      <div className="source-table">
        {sources.map((source) => (
          <a
            key={source.id}
            href={source.url}
            target="_blank"
            rel="noreferrer"
            className="source-row"
          >
            <span>{source.publisher}</span>
            <strong>{source.title}</strong>
            <em>{source.type}</em>
            <Badge
              tone={
                source.quality === "high"
                  ? "green"
                  : source.quality === "medium"
                    ? "blue"
                    : "amber"
              }
            >
              {source.quality}
            </Badge>
            <small>{source.lastChecked}</small>
          </a>
        ))}
      </div>
    </section>
  );
}
