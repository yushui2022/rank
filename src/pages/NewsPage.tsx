import { useMemo, useState } from "react";
import { newsEvents, sources, tracks } from "../data/rankingData";
import type { DomainId } from "../types/rankings";

const eventTypes = Array.from(new Set(newsEvents.map((event) => event.eventType)));

export function NewsPage() {
  const [domain, setDomain] = useState<DomainId | "all">("all");
  const [eventType, setEventType] = useState("All");

  const filteredEvents = useMemo(
    () =>
      newsEvents.filter((event) => {
        const domainMatch = domain === "all" || event.domainId === domain;
        const typeMatch = eventType === "All" || event.eventType === eventType;
        return domainMatch && typeMatch;
      }),
    [domain, eventType],
  );

  return (
    <main className="page-shell news-page">
      <section className="page-hero compact">
        <div>
          <span className="eyebrow">Ranking intelligence news</span>
          <h1>News</h1>
          <p>
            <span>Ranking updates and source changes.</span>
            <span>Company movements and model releases.</span>
            <span>Robotics deployments tied back to the index.</span>
          </p>
        </div>
        <div className="hero-metrics">
          <strong>{newsEvents.length}</strong>
          <span>ranking events</span>
        </div>
      </section>

      <section className="news-controls" aria-label="News filters">
        <div className="segmented-control">
          {(["all", "ai", "robotics"] as const).map((item) => (
            <button
              key={item}
              type="button"
              className={domain === item ? "is-active" : ""}
              onClick={() => setDomain(item)}
            >
              {item === "all" ? "All domains" : item.toUpperCase()}
            </button>
          ))}
        </div>
        <select value={eventType} onChange={(event) => setEventType(event.target.value)}>
          <option>All</option>
          {eventTypes.map((type) => (
            <option key={type}>{type}</option>
          ))}
        </select>
      </section>

      <section className="news-ledger">
        {filteredEvents.slice(0, 40).map((event) => {
          const track = tracks.find((item) => item.id === event.trackId);
          const eventSources = event.sourceIds
            .map((sourceId) => sources.find((source) => source.id === sourceId))
            .filter(Boolean);
          return (
            <article key={event.id} className="news-event">
              <div className="news-date">
                <span>{event.date}</span>
                <strong>{event.eventType}</strong>
              </div>
              <div className="news-body">
                <div className="news-kicker">
                  <span>{event.domainId.toUpperCase()}</span>
                  <span>{track?.name ?? event.affectedRanking}</span>
                  <span>{event.impact} impact</span>
                </div>
                <h2>{event.title}</h2>
                <p>
                  <span>{event.relatedEntity} leads this workbook snapshot.</span>
                  <span>Impact is tied to the source trail below.</span>
                </p>
                <div className="news-meta-grid">
                  <div>
                    <span>Related entity</span>
                    <strong>{event.relatedEntity}</strong>
                  </div>
                  <div>
                    <span>Affected ranking</span>
                    <strong>{event.affectedRanking}</strong>
                  </div>
                  <div>
                    <span>Source quality</span>
                    <strong>{event.sourceQuality}</strong>
                  </div>
                </div>
              </div>
              <aside className="news-source-stack">
                <span>Source trail</span>
                {eventSources.slice(0, 3).map((source) =>
                  source ? (
                    <a key={source.id} href={source.url} target="_blank" rel="noreferrer">
                      {source.publisher}
                    </a>
                  ) : null,
                )}
              </aside>
            </article>
          );
        })}
      </section>
    </main>
  );
}
