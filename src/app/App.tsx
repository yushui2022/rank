import { Suspense, lazy, useEffect, useState } from "react";
import { TopNav } from "../components/TopNav";
import type { AppPageId } from "../types/rankings";
import "./app.css";

const DownloadsPage = lazy(() =>
  import("../pages/DownloadsPage").then((module) => ({
    default: module.DownloadsPage,
  })),
);
const HonorRollPage = lazy(() =>
  import("../pages/HonorRollPage").then((module) => ({
    default: module.HonorRollPage,
  })),
);
const NewsPage = lazy(() =>
  import("../pages/NewsPage").then((module) => ({
    default: module.NewsPage,
  })),
);
const RankingsPage = lazy(() =>
  import("../pages/RankingsPage").then((module) => ({
    default: module.RankingsPage,
  })),
);
const SourcesPage = lazy(() =>
  import("../pages/SourcesPage").then((module) => ({
    default: module.SourcesPage,
  })),
);

const pageIds: AppPageId[] = [
  "rankings",
  "news",
  "downloads",
  "honor-roll",
  "sources",
];

const pageFromHash = (): AppPageId => {
  const hash = window.location.hash.replace(/^#\/?/, "");
  return pageIds.includes(hash as AppPageId) ? (hash as AppPageId) : "rankings";
};

const toggleInSet = (current: Set<string>, entityId: string) => {
  const next = new Set(current);
  if (next.has(entityId)) {
    next.delete(entityId);
  } else {
    next.add(entityId);
  }
  return next;
};

export function App() {
  const [activePage, setActivePage] = useState<AppPageId>(pageFromHash);
  const [watchedIds, setWatchedIds] = useState<Set<string>>(new Set());
  const [shortlistedIds, setShortlistedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const onHashChange = () => setActivePage(pageFromHash());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const setPage = (pageId: AppPageId) => {
    setActivePage(pageId);
    window.location.hash = pageId === "rankings" ? "" : pageId;
  };

  const toggleWatchlist = (entityId: string) => {
    setWatchedIds((current) => toggleInSet(current, entityId));
  };

  const toggleShortlist = (entityId: string) => {
    setShortlistedIds((current) => toggleInSet(current, entityId));
  };

  const renderPage = () => {
    switch (activePage) {
      case "downloads":
        return <DownloadsPage />;
      case "honor-roll":
        return <HonorRollPage />;
      case "news":
        return <NewsPage />;
      case "sources":
        return <SourcesPage />;
      case "rankings":
      default:
        return (
          <RankingsPage
            watchedIds={watchedIds}
            shortlistedIds={shortlistedIds}
            onToggleWatchlist={toggleWatchlist}
            onToggleShortlist={toggleShortlist}
          />
        );
    }
  };

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <TopNav
        watchlistCount={watchedIds.size}
        shortlistCount={shortlistedIds.size}
        activePage={activePage}
        onPageChange={setPage}
      />
      <div id="main-content">
        <Suspense
          fallback={
            <main className="page-shell">
            <section className="page-loading">
              <span className="eyebrow">Loading ranking surface</span>
              <strong>Preparing imported workbook data</strong>
            </section>
          </main>
          }
        >
          {renderPage()}
        </Suspense>
      </div>
    </div>
  );
}
