import { Suspense, lazy, useEffect, useState } from "react";
import { TopNav } from "../components/TopNav";
import { CategoryDemoPage } from "../pages/CategoryDemoPage";
import "./app.css";

const CompanyDetailPage = lazy(() =>
  import("../pages/CompanyDetailPage").then((module) => ({
    default: module.CompanyDetailPage,
  })),
);
const RankingsPage = lazy(() =>
  import("../pages/RankingsPage").then((module) => ({
    default: module.RankingsPage,
  })),
);

type AppPageId = "rankings";

type AppRoute =
  | { type: "page"; pageId: AppPageId }
  | { type: "company-detail"; entityId: string; trackId?: string };

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

const routeFromHash = (): AppRoute => {
  const hash = window.location.hash.replace(/^#\/?/, "");
  const [path, queryString = ""] = hash.split("?");
  const segments = path.split("/").filter(Boolean);

  if (segments[0] === "company" && segments[1]) {
    const params = new URLSearchParams(queryString);

    return {
      type: "company-detail",
      entityId: decodeURIComponent(segments[1]),
      trackId: params.get("track") ?? undefined,
    };
  }

  return {
    type: "page",
    pageId: "rankings",
  };
};

export function App() {
  const [route, setRoute] = useState<AppRoute>(routeFromHash);
  const [activeCategoryId, setActiveCategoryId] =
    useState<RankingCategoryId>("industry");

  useEffect(() => {
    const onHashChange = () => setRoute(routeFromHash());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const setPage = (pageId: AppPageId) => {
    setRoute({ type: "page", pageId });
    window.location.hash = "";
  };

  const openCompanyDetail = (entityId: string, trackId: string) => {
    window.location.hash = `/company/${encodeURIComponent(entityId)}?track=${encodeURIComponent(trackId)}`;
  };

  const renderPage = () => {
    if (route.type === "company-detail") {
      return (
        <CompanyDetailPage
          entityId={route.entityId}
          trackId={route.trackId}
          onBack={() => setPage("rankings")}
          onOpenCompany={openCompanyDetail}
        />
      );
    }

    if (activeCategoryId !== "industry") {
      return <CategoryDemoPage categoryId={activeCategoryId} />;
    }

    return <RankingsPage />;
  };

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <TopNav onRankingsClick={() => setPage("rankings")} />
      <div id="main-content">
        {route.type === "page" && (
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
