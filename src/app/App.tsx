import { categories } from "../data/mockCategories";
import { CategoryPanel } from "../components/CategoryPanel";
import { TrackList } from "../components/TrackList";
import "./app.css";

export function App() {
  const activeCategory = categories[0];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <div className="eyebrow">AI & Robotics Rankings</div>
          <h1>全球智能产业榜单</h1>
          <p>新前端仓库初始化版本，用于承接榜单产品的大重构。</p>
        </div>
        <CategoryPanel items={categories} activeId={activeCategory.id} />
      </aside>

      <main className="workspace">
        <header className="hero">
          <div>
            <div className="eyebrow">Current Focus</div>
            <h2>{activeCategory.name}</h2>
            <p>{activeCategory.description}</p>
          </div>
          <div className="hero-stats">
            <div>
              <span>一级大类</span>
              <strong>{categories.length}</strong>
            </div>
            <div>
              <span>当前二级类目</span>
              <strong>{activeCategory.tracks.length}</strong>
            </div>
          </div>
        </header>

        <section className="content-grid">
          <TrackList
            title={`${activeCategory.name} 二级结构`}
            description="当前先放信息架构占位，后续接榜单、详情页和来源数据。"
            tracks={activeCategory.tracks}
          />
        </section>
      </main>
    </div>
  );
}
