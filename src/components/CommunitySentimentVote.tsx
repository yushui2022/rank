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
    helperLabel: string,
  ) => {
    const count = currentStats[option];
    const pct = getPercentage(count);
    const isSelected = userVote === option;
    const isLeading = showResults && dominantVote === option;
    const voteStyle = {
      "--vote-pct": showResults ? `${pct}%` : "0%",
    } as CSSProperties;

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
    const higherWidth = showResults ? higherPct : 50;
    const lowerWidth = showResults ? lowerPct : 50;

    return (
      <div
        className={`sentiment-vote-rect-container sentiment-${dominantVote} variant-${variant} ${
          showResults ? "is-merged" : "is-split"
        } ${userVote ? `is-user-${userVote}` : ""}`}
        aria-label={`Community sentiment for ${entityName}`}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className={`vote-rect-half vote-rect-up vote-higher ${
            userVote === "higher" ? "is-voted" : ""
          }`}
          style={{ width: `${higherWidth}%` }}
          onClick={(event) => {
            event.stopPropagation();
            if (showResults) return;
            handleVote("higher");
          }}
          disabled={showResults}
          title={
            showResults
              ? `${higherPct}% think rank should be higher`
              : `${entityName}: UP`
          }
          aria-label={`${entityName}: UP`}
          aria-pressed={userVote === "higher"}
        >
          <span className="vote-content-layer vote-icon" aria-hidden={showResults}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 19V5M5 12l7-7 7 7"/>
            </svg>
          </span>
          <span className="vote-content-layer vote-text" aria-hidden={!showResults}>
            {higherPct >= 18 ? `${higherPct}%` : ""}
          </span>
        </button>
        <button
          type="button"
          className={`vote-rect-half vote-rect-down vote-lower ${
            userVote === "lower" ? "is-voted" : ""
          }`}
          style={{ width: `${lowerWidth}%` }}
          onClick={(event) => {
            event.stopPropagation();
            if (showResults) return;
            handleVote("lower");
          }}
          disabled={showResults}
          title={
            showResults
              ? `${lowerPct}% think rank should be lower`
              : `${entityName}: DOWN`
          }
          aria-label={`${entityName}: DOWN`}
          aria-pressed={userVote === "lower"}
        >
          <span className="vote-content-layer vote-icon" aria-hidden={showResults}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M19 12l-7 7-7-7"/>
            </svg>
          </span>
          <span className="vote-content-layer vote-text" aria-hidden={!showResults}>
            {lowerPct >= 18 ? `${lowerPct}%` : ""}
          </span>
        </button>
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
          "This company looks under-ranked",
        )}
        {renderVoteButton(
          "lower",
          "DOWN",
          "This company looks over-ranked",
        )}
      </div>
    </div>
  );
}
