import { useEffect, useMemo, useState } from "react";
import { CommunitySentimentVote } from "../components/CommunitySentimentVote";

import {
  demoBoardConfigs,
  type DemoBoardKind,
  type DemoCategoryId,
  type DemoRankItem,
  type DemoSubBoard,
} from "../data/categoryDemoRankings";

const avatarFor = (item: DemoRankItem, kind: DemoBoardKind) => {
  if (kind === "people") {
    return item.name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

  return item.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();
};

const momentumValue = (momentum: string) => {
  const numericValue = Number.parseFloat(momentum);
  if (!Number.isNaN(numericValue)) {
    return numericValue;
  }

  const quarterMatch = momentum.match(/Q([1-4])/i);
  return quarterMatch ? Number(quarterMatch[1]) : 0;
};

export function CategoryDemoPage({ categoryId }: { categoryId: DemoCategoryId }) {
  const config = demoBoardConfigs[categoryId];
  const boardViews: DemoSubBoard[] = useMemo(
    () =>
      config.subBoards ?? [
        {
          id: "default",
          label: config.title,
          eyebrow: config.eyebrow,
          description: config.description,
          note: config.profileNote,
          rows: config.rows,
        },
      ],
    [config],
  );
  const [selectedBoardId, setSelectedBoardId] = useState(boardViews[0].id);
  const [selectedSegment, setSelectedSegment] = useState("All");
  const [query, setQuery] = useState("");
  const activeBoard =
    boardViews.find((board) => board.id === selectedBoardId) ?? boardViews[0];
  const activeRows = activeBoard.rows;
  const activeSegments = useMemo(
    () =>
      config.segments.filter(
        (segment) =>
          segment === "All" || activeRows.some((row) => row.segment === segment),
      ),
    [activeRows, config.segments],
  );
  const [sortMode, setSortMode] = useState<"score" | "momentum" | "rank">("score");
  const [selectedId, setSelectedId] = useState(activeRows[0].id);

  useEffect(() => {
    setSelectedBoardId(boardViews[0].id);
    setSelectedSegment("All");
    setQuery("");
    setSortMode("score");
    setSelectedId(boardViews[0].rows[0].id);
  }, [boardViews]);

  useEffect(() => {
    if (!activeSegments.includes(selectedSegment)) {
      setSelectedSegment("All");
    }
  }, [activeSegments, selectedSegment]);

  const selectBoard = (boardId: string) => {
    const nextBoard = boardViews.find((board) => board.id === boardId) ?? boardViews[0];
    setSelectedBoardId(nextBoard.id);
    setSelectedSegment("All");
    setSelectedId(nextBoard.rows[0].id);
  };

  const selectSegment = (segment: string) => {
    setSelectedSegment(segment);
    setSelectedId(activeRows[0].id);
  };

  const resetBoard = () => {
    const defaultBoard = boardViews[0];
    setSelectedBoardId(defaultBoard.id);
    setSelectedSegment("All");
    setQuery("");
    setSortMode("score");
    setSelectedId(defaultBoard.rows[0].id);
  };

  const filteredRows = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const visibleRows = activeRows.filter((row) => {
      const segmentMatch =
        selectedSegment === "All" || row.segment === selectedSegment;
      const queryMatch =
        !normalized ||
        row.name.toLowerCase().includes(normalized) ||
        row.subline.toLowerCase().includes(normalized) ||
        row.tags.some((tag) => tag.toLowerCase().includes(normalized));
      return segmentMatch && queryMatch;
    });

    return [...visibleRows].sort((left, right) => {
      if (sortMode === "momentum") {
        return momentumValue(right.momentum) - momentumValue(left.momentum);
      }

      if (sortMode === "rank") {
        return left.rank - right.rank;
      }

      return right.score - left.score;
    });
  }, [activeRows, query, selectedSegment, sortMode]);

  const selectedItem =
    filteredRows.find((row) => row.id === selectedId) ??
    filteredRows[0] ??
    activeRows[0];

  const strongestMover = [...filteredRows].sort(
    (left, right) => momentumValue(right.momentum) - momentumValue(left.momentum),
  )[0];

  return (
    <div className={`product-layout demo-ranking-surface demo-${config.kind}`}>
      <aside className="domain-switcher">
        <div className="panel-heading">
          <span>{config.eyebrow}</span>
          <strong>{config.title}</strong>
        </div>

        {boardViews.length > 1 && (
          <div className="demo-board-switcher" aria-label={`${config.title} boards`}>
            <span className="demo-rail-label">Rank boards</span>
            {boardViews.map((board) => (
              <button
                key={board.id}
                type="button"
                className={`demo-board-toggle${
                  selectedBoardId === board.id ? " is-active" : ""
                }`}
                onClick={() => selectBoard(board.id)}
              >
                <span>
                  <strong>{board.label}</strong>
                  <em>{board.eyebrow}</em>
                </span>
                <b>{board.rows.length}</b>
              </button>
            ))}
          </div>
        )}

        <div className="domain-accordion demo-segment-rail">
          <span className="demo-rail-label">Scope filters</span>
          {activeSegments.map((segment) => (
            <button
              key={segment}
              type="button"
              className={`domain-toggle${
                selectedSegment === segment ? " is-active" : ""
              }`}
              onClick={() => selectSegment(segment)}
            >
              <span className="tick" aria-hidden="true" />
              <span>{segment}</span>
              <em>
                {segment === "All"
                  ? activeBoard.note
                  : config.segmentLabel}
              </em>
            </button>
          ))}
        </div>
      </aside>

      <main className="workspace">
        <section className="demo-board-hero">
          <div>
            <span className="eyebrow">{activeBoard.eyebrow}</span>
            <h1>{activeBoard.label}</h1>
            <p>{activeBoard.description}</p>
          </div>
          <div className="demo-board-metrics">
            <div>
              <span>Listed</span>
              <strong>{activeRows.length}</strong>
            </div>
            <div>
              <span>Boards</span>
              <strong>{boardViews.length}</strong>
            </div>
            <div>
              <span>Demo status</span>
              <strong>Mock</strong>
            </div>
          </div>
        </section>

        <div className="ranking-toolbar-container">
          <section className="ranking-toolbar">
            <label className="search-field">
              <span>Search</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={`Search ${activeBoard.label.toLowerCase()}...`}
              />
            </label>
            <label>
              <span>{config.segmentLabel}</span>
              <select
                value={selectedSegment}
                onChange={(event) => selectSegment(event.target.value)}
              >
                {activeSegments.map((segment) => (
                  <option key={segment}>{segment}</option>
                ))}
              </select>
            </label>
            <label>
              <span>Sort</span>
              <select
                value={sortMode}
                onChange={(event) =>
                  setSortMode(event.target.value as "score" | "momentum" | "rank")
                }
              >
                <option value="score">Score high to low</option>
                <option value="momentum">Momentum signal</option>
                <option value="rank">Rank order</option>
              </select>
            </label>
            <button
              type="button"
              className="ghost-button"
              onClick={resetBoard}
            >
              Reset
            </button>
          </section>
        </div>

        <section className="mini-boards-strip" aria-label={`${config.title} summary`}>
          <div className="mini-boards-grid demo-mini-boards">
            <div className="mini-board-card">
              <div className="mini-board-head">
                <strong>Board logic</strong>
                <span>{activeBoard.note}</span>
              </div>
              <div className="demo-summary-list">
                <span>{activeBoard.eyebrow}</span>
                <span>{config.entityLabel}</span>
                <span>{config.signalLabel}</span>
                <span>{config.scoreColumn} score</span>
              </div>
            </div>
            <div className="mini-board-card">
              <div className="mini-board-head">
                <strong>Momentum signal</strong>
                <span>Highest visible movement in this board</span>
              </div>
              {strongestMover ? (
                <button
                  type="button"
                  className="demo-highlight-row"
                  onClick={() => setSelectedId(strongestMover.id)}
                >
                  <span className="mini-board-logo">
                    {avatarFor(strongestMover, config.kind)}
                  </span>
                  <span>
                    <strong>{strongestMover.name}</strong>
                    <em>{strongestMover.momentum} momentum</em>
                  </span>
                </button>
              ) : (
                <p className="demo-muted">No matching momentum signal.</p>
              )}
            </div>
            <div className="mini-board-card">
              <div className="mini-board-head">
                <strong>Source discipline</strong>
                <span>Every production row should link to source evidence</span>
              </div>
              <div className="demo-source-rule">
                <strong>{selectedItem.evidence}</strong>
                <span>Mock evidence count shown for layout validation.</span>
              </div>
            </div>
          </div>
        </section>

        <div className="content-grid">
          <div className="ranking-layout">
            <section className="ranking-panel">
              <div className="panel-title-row">
                <div>
                  <span>{activeBoard.eyebrow}</span>
                  <h2>{activeBoard.label}</h2>
                </div>
                <p>
                  {filteredRows.length} visible / {activeRows.length} listed
                </p>
              </div>

              <div className="table-wrap">
                <table className="ranking-table zebra-striped">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>{config.entityLabel}</th>
                      <th>{config.signalLabel}</th>
                      <th>{config.scoreColumn}</th>
                      <th>Momentum</th>
                      <th>Community</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRows.length === 0 && (
                      <tr className="empty-row">
                        <td colSpan={6}>
                          No matching entries. Reset filters to restore the demo.
                        </td>
                      </tr>
                    )}
                    {filteredRows.map((row) => (
                      <tr
                        key={row.id}
                        className={row.id === selectedItem.id ? "is-selected" : ""}
                        onClick={() => setSelectedId(row.id)}
                      >
                        <td className="rank-cell">
                          <span
                            className={`rank-badge${
                              row.rank <= 3 ? ` rank-${row.rank}` : ""
                            }`}
                          >
                            {row.rank}
                          </span>
                        </td>
                        <td>
                          <div className="entity-cell">
                            <span
                              className={`entity-logo${
                                config.kind === "people" ? " is-person" : ""
                              }`}
                            >
                              {avatarFor(row, config.kind)}
                            </span>
                            <span>
                              <strong>{row.name}</strong>
                              <em className="entity-meta">{row.subline}</em>
                            </span>
                          </div>
                        </td>
                        <td>
                          <div className="demo-signal-cell">
                            <strong>{row.segment}</strong>
                            <span>{row.signal}</span>
                          </div>
                        </td>
                        <td className="demo-score-cell">
                          <strong>{row.score.toFixed(1)}</strong>
                          <span>{row.scoreLabel}</span>
                        </td>
                        <td>
                          <span className="category-badge">{row.momentum}</span>
                        </td>
                        <td onClick={(event) => event.stopPropagation()}>
                          <CommunitySentimentVote
                            entityId={row.id}
                            entityName={row.name}
                            variant="mini"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          <aside className="history-sidebar">
            <section className="demo-profile-panel">
              <div className="demo-profile-head">
                <span
                  className={`demo-profile-avatar${
                    config.kind === "people" ? " is-person" : ""
                  }`}
                >
                  {avatarFor(selectedItem, config.kind)}
                </span>
                <div>
                  <span className="eyebrow">{activeBoard.label} profile</span>
                  <h2>{selectedItem.name}</h2>
                  <p>{selectedItem.subline}</p>
                </div>
              </div>

              <div className="demo-profile-stats">
                <div>
                  <span>{config.scoreColumn}</span>
                  <strong>{selectedItem.score.toFixed(1)}</strong>
                </div>
                <div>
                  <span>Evidence</span>
                  <strong>{selectedItem.evidence}</strong>
                </div>
                <div>
                  <span>Signal A</span>
                  <strong>{selectedItem.statA}</strong>
                </div>
                <div>
                  <span>Signal B</span>
                  <strong>{selectedItem.statB}</strong>
                </div>
              </div>

              <div className="demo-profile-section">
                <span>Analyst summary</span>
                <p>{selectedItem.summary}</p>
              </div>

              <div className="demo-profile-section">
                <span>Tags</span>
                <div className="demo-tag-row">
                  {selectedItem.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </div>

              <div className="demo-profile-section">
                <span>Design customization</span>
                <ul>
                  <li>Shared shell, filters, row selection and right detail panel.</li>
                  <li>
                    Custom columns for {config.kind === "people"
                      ? "people influence"
                      : config.kind === "report"
                        ? "report intelligence"
                        : "ecosystem strength"}
                    .
                  </li>
                  <li>Mock data only; production rows should attach sources.</li>
                </ul>
              </div>

              <CommunitySentimentVote
                entityId={selectedItem.id}
                entityName={selectedItem.name}
                variant="panel"
              />
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}
