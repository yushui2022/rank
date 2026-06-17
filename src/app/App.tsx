import { Suspense, lazy, useEffect, useState } from "react";
import { TopNav } from "../components/TopNav";
import { CategoryDemoPage } from "../pages/CategoryDemoPage";
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

export type RankingCategoryId =
  | "industry"
  | "ai-top100"
  | "a25"
  | "contributors"
  | "cities"
  | "universities"
  | "reports";

const rankingCategories: { id: RankingCategoryId; label: string }[] = [
  { id: "industry", label: "Industry Rankings" },
  { id: "ai-top100", label: "AI Top 100 Influencers" },
  { id: "a25", label: "AI Under 25" },
  { id: "contributors", label: "Top Contributors" },
  { id: "cities", label: "Global AI Cities TOP 10" },
  { id: "universities", label: "Top 10 AI Universities" },
  { id: "reports", label: "Special Reports" },
];

const pageFromHash = (): AppPageId => {
  const hash = window.location.hash.replace(/^#\/?/, "");
  return pageIds.includes(hash as AppPageId) ? (hash as AppPageId) : "rankings";
};

export function App() {
  const [activePage, setActivePage] = useState<AppPageId>(pageFromHash);
  const [activeCategoryId, setActiveCategoryId] =
    useState<RankingCategoryId>("industry");

  useEffect(() => {
    const onHashChange = () => setActivePage(pageFromHash());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const setPage = (pageId: AppPageId) => {
    setActivePage(pageId);
    window.location.hash = pageId === "rankings" ? "" : pageId;
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
        if (activeCategoryId !== "industry") {
          return <CategoryDemoPage categoryId={activeCategoryId} />;
        }

        return <RankingsPage />;
    }
  };

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <TopNav activePage={activePage} onPageChange={setPage} />
      <div id="main-content">
        {activePage === "rankings" && (
          <nav className="category-index-header" aria-label="Ranking category">
            <div className="category-index-container">
              {rankingCategories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  className={`category-tab${
                    activeCategoryId === category.id ? " is-active" : ""
                  }`}
                  aria-current={
                    activeCategoryId === category.id ? "page" : undefined
                  }
                  onClick={() => setActiveCategoryId(category.id)}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </nav>
        )}
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
