import { useMemo, useState } from "react";
import { newsEvents, sources } from "../data/rankingData";
import type { DomainId } from "../types/rankings";

const eventTypes = Array.from(new Set(newsEvents.map((event) => event.eventType)));
const impactOptions = ["All", "High", "Medium", "Low"] as const;

export function NewsPage() {
  const [domain, setDomain] = useState<DomainId | "all">("all");
  const [eventType, setEventType] = useState("All");
  const [impact, setImpact] = useState<(typeof impactOptions)[number]>("All");

  const filteredEvents = useMemo(
    () =>
      newsEvents.filter((event) => {
        const domainMatch = domain === "all" || event.domainId === domain;
        const typeMatch = eventType === "All" || event.eventType === eventType;
        const impactMatch = impact === "All" || event.impact === impact;
        return domainMatch && typeMatch && impactMatch;
      }),
    [domain, eventType, impact],
  );

  const briefingMetrics = [
    { label: "Visible events", value: filteredEvents.length },
    {
      label: "High impact",
      value: filteredEvents.filter((event) => event.impact === "High").length,
    },
    {
      label: "Robotics-linked",
      value: filteredEvents.filter((event) => event.domainId === "robotics").length,
    },
    {
      label: "Source-linked",
      value: filteredEvents.filter((event) => event.sourceIds.length > 0).length,
    },
  ];

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

      <section className="news-briefing-strip" aria-label="News briefing summary">
        {briefingMetrics.map((metric) => (
          <div key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
          </div>
        ))}
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
        <select
          value={impact}
          onChange={(event) =>
            setImpact(event.target.value as (typeof impactOptions)[number])
          }
        >
          {impactOptions.map((item) => (
            <option key={item} value={item}>
              {item === "All" ? "All impact" : `${item} impact`}
            </option>
          ))}
        </select>
      </section>

      <div className="news-layout">
        <section className="news-hero-article">
          <div className="news-hero-image" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')" }} />
          <div className="news-hero-content">
            <span className="news-hero-kicker">News</span>
            <h2 className="news-hero-title">ByteDance sets four AI priorities for 2026</h2>
            <div className="news-hero-meta">
              <span>6 mins read</span>
              <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 2C1 1.44772 1.44772 1 2 1H12C12.5523 1 13 1.44772 13 2V14.5C13 14.8988 12.569 15.1482 12.2173 14.9532L7.48274 12.3284C7.17935 12.1601 6.82065 12.1601 6.51726 12.3284L1.78274 14.9532C1.43098 15.1482 1 14.8988 1 14.5V2Z" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
            </div>
          </div>
        </section>

        <section className="news-timeline-container">
          <div className="news-timeline-header">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="var(--accent)" strokeWidth="2"/>
              <path d="M7 12H9.5L10.5 8L13.5 16L14.5 12H17" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h2>Pulses</h2>
          </div>

          <div className="news-timeline">
            {filteredEvents.slice(0, 5).map((event) => {
              const eventSources = event.sourceIds
                .map((sourceId) => sources.find((source) => source.id === sourceId))
                .filter(Boolean);
              
              const sourceName = eventSources[0]?.publisher || "Industry Source";

              return (
                <article key={event.id} className="news-timeline-item">
                  <h3>{event.title}</h3>
                  <div className="news-timeline-meta">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    <span>{event.date}</span>
                    <span>@</span>
                    <span>{sourceName}</span>
                  </div>
                  <p>
                    {event.relatedEntity} leads {event.affectedRanking}. Snapshot {event.date}; source trail attached. {event.impact} impact on the {event.domainId.toUpperCase()} rankings.
                  </p>
                </article>
              );
            })}
          </div>

          <div className="news-timeline-footer">
            <button type="button">See All</button>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="10 8 14 12 10 16"/>
            </svg>
          </div>
        </section>
      </div>

      <div className="news-list-container">
        <h2 className="news-list-title">Latest Updates</h2>
        <div className="news-list">
          {filteredEvents.slice(5, 40).map((event) => {
            const eventSources = event.sourceIds
              .map((sourceId) => sources.find((source) => source.id === sourceId))
              .filter(Boolean);
            
            const sourceName = eventSources[0]?.publisher || "Industry Source";

            return (
              <article key={event.id} className="news-list-row">
                <div className="news-list-date">{event.date}</div>
                <div className="news-list-core">
                  <h3>{event.title}</h3>
                  <p>{event.relatedEntity} leads {event.affectedRanking}. {event.impact} impact.</p>
                </div>
                <div className="news-list-source">
                  <span>{sourceName}</span>
                </div>
                <div className="news-list-type">
                  <span className="badge">{event.eventType}</span>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </main>
  );
}
