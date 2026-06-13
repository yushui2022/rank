import { CommunitySentimentVote } from "../components/CommunitySentimentVote";

export function CategoryDemoPage({ category }: { category: string }) {
  // �����ж��߼�������� vs ���������
  const isPerson = category.includes("Influencers") || category.includes("Under 25") || category.includes("Contributors");

  // ģ�ⶨ�ƻ����ݣ�������л��ṹ��
  const mockData = isPerson ? [
    { id: "p1", name: "Ilya Sutskever", sub: "OpenAI / SSI", metric: "99.8", rank: 1, field: "Deep Learning", trend: "+1" },
    { id: "p2", name: "Yann LeCun", sub: "Meta", metric: "98.5", rank: 2, field: "Computer Vision", trend: "0" },
    { id: "p3", name: "Demis Hassabis", sub: "Google DeepMind", metric: "98.1", rank: 3, field: "AGI Research", trend: "+2" },
    { id: "p4", name: "Fei-Fei Li", sub: "Stanford University", metric: "96.4", rank: 4, field: "Vision & Ethics", trend: "+1" },
    { id: "p5", name: "Andrej Karpathy", sub: "Eureka Labs", metric: "95.0", rank: 5, field: "Autonomous AI", trend: "0" }
  ] : [
    { id: "c1", name: "San Francisco", sub: "USA", metric: "100.0", rank: 1, field: "Silicon Valley Hub", trend: "0" },
    { id: "c2", name: "Beijing", sub: "China", metric: "95.2", rank: 2, field: "Zhongguancun Zone", trend: "+1" },
    { id: "c3", name: "London", sub: "UK", metric: "92.4", rank: 3, field: "Knowledge Quarter", trend: "0" },
    { id: "c4", name: "New York", sub: "USA", metric: "88.9", rank: 4, field: "Silicon Alley", trend: "+2" },
    { id: "c5", name: "Toronto", sub: "Canada", metric: "86.5", rank: 5, field: "Vector Institute", trend: "-1" }
  ];

  return (
    <div className="product-layout">
      {/* ��������滻��ԭ�е� Industry Domain����Ϊ��������/������λ���� */}
      <aside className="domain-switcher">
        <div className="panel-heading">
          <span>Segments</span>
          <strong>{category}</strong>
        </div>
        <div className="domain-accordion">
          <button className="domain-toggle is-active">
            <span className="tick"></span>
            <span>{isPerson ? "Researchers" : "Tier 1 Hubs"}</span>
          </button>
          <button className="domain-toggle">
            <span className="tick"></span>
            <span>{isPerson ? "Entrepreneurs" : "Emerging Hubs"}</span>
          </button>
          <button className="domain-toggle">
            <span className="tick"></span>
            <span>{isPerson ? "Policy Makers" : "Academic Centers"}</span>
          </button>
        </div>
      </aside>

      <main className="workspace">
        <div className="ranking-toolbar-container">
          <section className="ranking-toolbar">
            <label className="search-field">
              <span>Search</span>
              <input placeholder={`Search ${category}...`} />
            </label>
            <label>
              <span>{isPerson ? "Field" : "Region"}</span>
              <select>
                <option>All</option>
                <option>{isPerson ? "Vision" : "North America"}</option>
                <option>{isPerson ? "NLP" : "Asia"}</option>
              </select>
            </label>
            <button className="ghost-button">Reset</button>
          </section>
        </div>

        <div className="content-grid">
          <div className="ranking-layout">
            <div className="ranking-table-wrapper">
              <table className="ranking-table">
                <thead>
                  <tr>
                    <th style={{ width: "60px" }}>Rank</th>
                    {/* ��ͷ���ƵĶ�̬���ƻ� */}
                    <th>{isPerson ? "Profile" : "Entity"}</th>
                    <th>{isPerson ? "Focus Area" : "Ecosystem"}</th>
                    <th style={{ textAlign: "right" }}>Index Score</th>
                    <th style={{ width: "220px", textAlign: "right" }}>Sentiment</th>
                  </tr>
                </thead>
                <tbody>
                  {mockData.map((row) => (
                    <tr key={row.id}>
                      <td>
                        <div className="rank-cell">
                          <strong>#{row.rank}</strong>
                        </div>
                      </td>
                      <td>
                        <div className="entity-cell">
                          {/* ����񵥲���Բ��ͷ����� (.is-person) */}
                          <div className={`entity-logo ${isPerson ? 'is-person' : ''}`}>
                            {row.name.charAt(0)}
                          </div>
                          <div className="entity-title">
                            <strong>{row.name}</strong>
                            <p>{row.sub}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        {/* ר���Ľ���΢����� */}
                        <span className="category-badge">{row.field}</span>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <strong style={{ fontSize: "16px", fontFamily: "var(--mono)" }}>{row.metric}</strong>
                      </td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <div style={{ transform: "scale(0.9)", transformOrigin: "right center" }}>
                          <CommunitySentimentVote entityId={row.id} entityName={row.name} variant="mini" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <aside className="history-sidebar">
            <div className="market-bar">
              <div className="market-bar-id">
                <span className="live-dot"></span>
                <div>
                  <span className="eyebrow">Category Insights</span>
                  <h1 style={{ fontSize: "24px" }}>{category}</h1>
                </div>
              </div>
            </div>
            <div className="board-controls">
              <div className="view-note" style={{ marginBottom: "16px" }}>
                <div>
                  <strong>Customized View Active</strong>
                  <span>Displaying tailored columns for {isPerson ? "Individuals" : "Locations"}</span>
                </div>
              </div>
              <p style={{ color: "var(--ink-2)", fontSize: "14px", lineHeight: "1.6", margin: 0 }}>
                ��ģ��ײ�̳��� <strong>��ҵ���� (Industry Rankings)</strong> �ı�׼�����ܣ�����Ե�ǰҵ��ע�������¶��ƻ���ƣ�
                <br /><br />
              </p>
              {isPerson ? (
                <ul style={{ paddingLeft: "20px", margin: 0, color: "var(--ink-2)", fontSize: "14px", lineHeight: "1.6" }}>
                  <li>���� <strong>Բ��ͷ�� (Circular Avatars)</strong> ǿ�������������ԡ�</li>
                  <li>����ҵ�ִ��滻Ϊ <strong>�о������ǩ (Focus Area Tags)</strong>��</li>
                  <li>�������·���̬��ʾ <strong>���ڻ��� (Affiliation)</strong>��</li>
                </ul>
              ) : (
                <ul style={{ paddingLeft: "20px", margin: 0, color: "var(--ink-2)", fontSize: "14px", lineHeight: "1.6" }}>
                  <li>����ͷ�л�Ϊ <strong>��̬ϵͳ (Ecosystem)</strong> ׷�١�</li>
                  <li>�������Զ��л�Ϊ <strong>�������� (Geographic Groupings)</strong>��</li>
                  <li>�ײ�ƥ���Ӧ�� <strong>����/����΢�� (Country/Region Labels)</strong>��</li>
                </ul>
              )}
              <p style={{ color: "var(--ink-2)", fontSize: "14px", lineHeight: "1.6", margin: 0 }}>
                <br />
                ���������Ѿ���֮ǰ������<strong>��������ͶƱ���</strong>�޷�ƽ�Ƽ��ɵ�����Щ�°��С�
              </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
