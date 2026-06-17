import { useEffect, useMemo, useState, type CSSProperties } from "react";

export type VoteOption = "higher" | "lower";

type VoteStats = {
  higher: number;
  lower: number;
  total: number;
};

type CommunitySentimentVoteProps = {
  entityId: string;
  entityName: string;
  variant?: "panel" | "inline" | "mini";
};

const generateMockStats = (id: string): VoteStats => {
  const sum = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const higher = 38 + ((sum * 2) % 42);
  const lower = 24 + ((sum * 3) % 38);

  return {
    higher,
    lower,
    total: higher + lower,
  };
};

export function CommunitySentimentVote({
  entityId,
  entityName,
  variant = "panel",
}: CommunitySentimentVoteProps) {
  const [hasVoted, setHasVoted] = useState(false);
  const [userVote, setUserVote] = useState<VoteOption | null>(null);

  const baseStats = useMemo(() => generateMockStats(entityId), [entityId]);

  useEffect(() => {
    setHasVoted(false);
    setUserVote(null);
  }, [entityId]);

  const handleVote = (option: VoteOption) => {
    setUserVote(option);
    setHasVoted(true);
  };

  const currentStats = useMemo(() => {
    if (!hasVoted || !userVote) return baseStats;

    return {
      ...baseStats,
      [userVote]: baseStats[userVote] + 1,
      total: baseStats.total + 1,
    };
  }, [baseStats, hasVoted, userVote]);

  const getPercentage = (count: number) => {
    if (currentStats.total === 0) return 0;
    return Math.round((count / currentStats.total) * 100);
  };

  const showResults = hasVoted;
  const higherPct = getPercentage(currentStats.higher);
  const lowerPct = getPercentage(currentStats.lower);
  const dominantVote: VoteOption =
    currentStats.higher >= currentStats.lower ? "higher" : "lower";
  const crowdLabel = showResults
    ? dominantVote === "higher"
      ? "Crowd says under-ranked"
      : "Crowd says over-ranked"
    : "Vote to reveal crowd split";
  const feedbackLabel = userVote
    ? userVote === "higher"
      ? "Your signal: rank should be higher"
      : "Your signal: rank should be lower"
    : crowdLabel;

  const renderVoteButton = (
    option: VoteOption,
    label: string,
    shortLabel: string,
    helperLabel: string,
  ) => {
    const count = currentStats[option];
    const pct = getPercentage(count);
    const isSelected = userVote === option;
    const isLeading = showResults && dominantVote === option;
    const voteStyle = {
      "--vote-pct": showResults ? `${pct}%` : "0%",
    } as CSSProperties;

    if (variant === "inline" || variant === "mini") {
      const displayLabel =
        variant === "mini" && option === "lower" ? "DN" : shortLabel;

      return (
        <button
          type="button"
          className={`sentiment-vote-inline-btn vote-${option} ${
            isSelected ? "is-voted" : ""
          } ${isLeading ? "is-leading" : ""}`}
          onClick={(event) => {
            event.stopPropagation();
            handleVote(option);
          }}
          style={voteStyle}
          title={`${entityName}: ${label}`}
          aria-label={`${entityName}: ${label}`}
          aria-pressed={isSelected}
        >
          <span className="vote-inline-icon">{displayLabel}</span>
          {showResults && <span className="vote-inline-pct">{pct}%</span>}
        </button>
      );
    }

    return (
      <button
        type="button"
        className={`sentiment-vote-btn vote-${option} ${
          isSelected ? "is-voted" : ""
        } ${isLeading ? "is-leading" : ""}`}
        onClick={(event) => {
          event.stopPropagation();
          handleVote(option);
        }}
        style={voteStyle}
        aria-label={`${entityName}: ${label}`}
        aria-pressed={isSelected}
      >
        <span>
          <span className="vote-label">{label}</span>
          <em>{helperLabel}</em>
        </span>
        {showResults && <span className="vote-pct">{pct}%</span>}
      </button>
    );
  };

  if (variant === "inline" || variant === "mini") {
    return (
      <div
        className={`sentiment-vote-inline-group sentiment-${dominantVote} ${
          showResults ? "has-voted" : ""
        } variant-${variant}`}
        aria-label={`Community sentiment for ${entityName}`}
      >
        {renderVoteButton(
          "higher",
          "UP",
          "UP",
          "Company is under-ranked",
        )}
        {renderVoteButton(
          "lower",
          "DOWN",
          "DOWN",
          "Company is over-ranked",
        )}
      </div>
    );
  }

  return (
    <div className={`sentiment-vote-panel ${showResults ? "has-voted" : "is-locked"}`}>
      <div className="sentiment-vote-head">
        <h3>Community sentiment</h3>
        <span>{currentStats.total} votes</span>
      </div>
      {showResults ? (
        <div className={`sentiment-consensus sentiment-${dominantVote}`}>
          <strong>{feedbackLabel}</strong>
          <span>
            {higherPct}% want higher / {lowerPct}% want lower
          </span>
        </div>
      ) : (
        <div className="sentiment-preview">
          <strong>{feedbackLabel}</strong>
          <span>Click UP or DOWN to unlock the crowd split.</span>
        </div>
      )}
      <div className="sentiment-vote-actions">
        {renderVoteButton(
          "higher",
          "UP",
          "UP",
          "This company looks under-ranked",
        )}
        {renderVoteButton(
          "lower",
          "DOWN",
          "DOWN",
          "This company looks over-ranked",
        )}
      </div>
    </div>
  );
}
