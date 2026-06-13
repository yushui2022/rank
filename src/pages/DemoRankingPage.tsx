import { useState } from "react";
import { mockInfluencers, type Influencer } from "../data/mockDemoData";
import { CommunitySentimentVote } from "../components/CommunitySentimentVote";

type DemoRankingPageProps = {
  categoryName: string;
};

export function DemoRankingPage({ categoryName }: DemoRankingPageProps) {
  const [selectedId, setSelectedId] = useState<string>(mockInfluencers[0].id);
  const selectedPerson = mockInfluencers.find(p => p.id === selectedId) || mockInfluencers[0];

  return (
    <div className="product-layout">
      <aside className="domain-switcher">
        <div className="panel-heading">
          <span>Filters</span>
          <strong>Segments</strong>
        </div>
        <div className="domain-accordion">
          <div className="accordion-group">
            <button className="domain-toggle is-active">
              <span className="tick" aria-hidden="true" />
              <span>All Leaders</span>
            </button>
            <button className="domain-toggle">
              <span className="tick" aria-hidden="true" />
              <span>Entrepreneurs</span>
            </button>
            <button className="domain-toggle">
              <span className="tick" aria-hidden="true" />
              <span>Researchers</span>
            </button>
          </div>
        </div>
      </aside>

      <main className="workspace">
        <div className="market-bar">
          <div className="market-bar-id">
            <div className="live-dot" />
            <span className="eyebrow">LIVE</span>
          </div>
          <div>
            <h1>{categoryName}</h1>
            <p>Demo showcasing custom layout for people and entity rankings</p>
          </div>
          <div className="market-stats">
            <div className="market-stat">
              <span>Entities</span>
              <strong>{mockInfluencers.length}</strong>
            </div>
            <div className="market-stat">
              <span>Updated</span>
              <strong>Today</strong>
            </div>
          </div>
        </div>

        <div className="content-grid">
          <div className="ranking-layout">
            <div className="ranking-table-wrapper">
              <table className="ranking-table">
                <thead>
                  <tr>
                    <th style={{ width: '48px', textAlign: 'center' }}>#</th>
                    <th>Influencer</th>
                    <th>Organization</th>
                    <th style={{ textAlign: 'right' }}>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {mockInfluencers.map((person) => (
                    <tr
                      key={person.id}
                      className={person.id === selectedId ? "is-selected" : ""}
                      onClick={() => setSelectedId(person.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td style={{ textAlign: 'center' }}>
                        <span className="rank-badge">{person.rank}</span>
                      </td>
                      <td>
                        <div className="entity-cell">
                          <div className="entity-logo">{person.avatar}</div>
                          <div>
                            <strong>{person.name}</strong>
                            <div className="entity-meta">{person.role}</div>
                          </div>
                        </div>
                      </td>
                      <td>{person.organization}</td>
                      <td style={{ textAlign: 'right' }}>
                        <strong style={{ fontSize: '16px' }}>{person.score.toFixed(1)}</strong>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <aside className="history-sidebar">
            <div className="intelligence-rail" style={{ position: 'sticky', top: '24px' }}>
              <div className="rail-head">
                <span className="eyebrow">Influence Profile</span>
              </div>
              <div style={{ textAlign: 'center', margin: '20px 0' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '40px', background: 'var(--accent)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: 'bold', margin: '0 auto 16px' }}>
                  {selectedPerson.avatar}
                </div>
                <h2 style={{ margin: '0 0 4px', fontSize: '24px' }}>{selectedPerson.name}</h2>
                <p style={{ margin: 0, color: 'var(--ink-2)', fontSize: '14px' }}>{selectedPerson.role} @ {selectedPerson.organization}</p>
              </div>

              <div style={{ borderTop: '1px solid var(--line)', paddingTop: '16px', marginTop: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ background: 'var(--panel-2)', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', color: 'var(--ink-3)', textTransform: 'uppercase', fontWeight: 'bold' }}>Score</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--ink)', marginTop: '4px' }}>{selectedPerson.score.toFixed(1)}</div>
                  </div>
                  <div style={{ background: 'var(--panel-2)', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', color: 'var(--ink-3)', textTransform: 'uppercase', fontWeight: 'bold' }}>Citations</div>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--ink)', marginTop: '8px' }}>{selectedPerson.citation}</div>
                  </div>
                </div>

                <h3 style={{ fontSize: '14px', marginBottom: '8px' }}>Focus Areas</h3>
                <div className="topic-panel" style={{ marginBottom: '16px' }}>
                  {selectedPerson.areas.map(area => (
                    <span key={area} style={{ background: 'var(--bg-2)', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', color: 'var(--ink-2)' }}>
                      {area}
                    </span>
                  ))}
                </div>

                <h3 style={{ fontSize: '14px', marginBottom: '8px' }}>Biography</h3>
                <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--ink-2)', margin: 0 }}>
                  {selectedPerson.bio}
                </p>
              </div>

              <div style={{ marginTop: '24px' }}>
                <CommunitySentimentVote entityId={selectedPerson.id} entityName={selectedPerson.name} variant="panel" />
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
