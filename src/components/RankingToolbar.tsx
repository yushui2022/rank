import type { FilterState } from "../types/rankings";

type RankingToolbarProps = {
  filters: FilterState;
  regions: string[];
  stages: string[];
  entityTypes: string[];
  onFiltersChange: (filters: FilterState) => void;
  onReset: () => void;
};

export function RankingToolbar({
  filters,
  regions,
  stages,
  entityTypes,
  onFiltersChange,
  onReset,
}: RankingToolbarProps) {
  return (
    <section className="ranking-toolbar" aria-label="Ranking filters">
      <label className="search-field">
        <span>Search</span>
        <input
          value={filters.query}
          onChange={(event) =>
            onFiltersChange({ ...filters, query: event.target.value })
          }
          placeholder="Company, model, robot, category..."
        />
      </label>

      <label>
        <span>Region</span>
        <select
          value={filters.region}
          onChange={(event) =>
            onFiltersChange({ ...filters, region: event.target.value })
          }
        >
          <option value="All">All</option>
          {regions.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>
      </label>

      <label>
        <span>Stage</span>
        <select
          value={filters.stage}
          onChange={(event) =>
            onFiltersChange({ ...filters, stage: event.target.value })
          }
        >
          <option value="All">All</option>
          {stages.map((stage) => (
            <option key={stage} value={stage}>
              {stage}
            </option>
          ))}
        </select>
      </label>

      <label>
        <span>Type</span>
        <select
          value={filters.entityType}
          onChange={(event) =>
            onFiltersChange({ ...filters, entityType: event.target.value })
          }
        >
          <option value="All">All</option>
          {entityTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </label>

      <button type="button" className="ghost-button" onClick={onReset}>
        Reset
      </button>

      <button type="button" className="ghost-button" title="Prototype column selector">
        Columns
      </button>
    </section>
  );
}
