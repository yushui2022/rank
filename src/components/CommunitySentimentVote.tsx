import { useState, useMemo } from "react";

export type VoteOption = "higher" | "fair" | "lower";

type VoteStats = {
  higher: number;
  fair: number;
  lower: number;
  total: number;
};

type CommunitySentimentVoteProps = {
  entityId: string;
  entityName: string;
  variant?: "panel" | "inline" | "mini";
};

const generateMockStats = (id: string): VoteStats => {
  // Use the string characters to generate a stable pseudo-random distribution
  const sum = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // Base numbers
  let fair = 40 + (sum % 30);
  let higher = 15 + ((sum * 2) % 40);
  let lower = 10 + ((sum * 3) % 25);
  
  return {
    fair,
    higher,
    lower,
    total: fair + higher + lower
  };
};

export function CommunitySentimentVote({ entityId, entityName, variant = "panel" }: CommunitySentimentVoteProps) {
  // Mock API state
  const [hasVoted, setHasVoted] = useState<boolean>(false);
  const [userVote, setUserVote] = useState<VoteOption | null>(null);
  
  const baseStats = useMemo(() => generateMockStats(entityId), [entityId]);
  
  // Reset vote state when entity changes
  // In a real app, this would check if the user has already voted for this entity via API
  useMemo(() => {
    setHasVoted(false);
    setUserVote(null);
  }, [entityId]);

  const handleVote = (option: VoteOption) => {
    if (hasVoted) return;
    setUserVote(option);
    setHasVoted(true);
  };

  const currentStats = useMemo(() => {
    if (!hasVoted || !userVote) return baseStats;
    
    return {
      ...baseStats,
      [userVote]: baseStats[userVote] + 1,
      total: baseStats.total + 1
    };
  }, [baseStats, hasVoted, userVote]);

  const getPercentage = (count: number) => {
    if (currentStats.total === 0) return 0;
    return Math.round((count / currentStats.total) * 100);
  };

  const renderVoteButton = (option: VoteOption, label: string, shortLabel: string) => {
    const count = currentStats[option];
    const pct = getPercentage(count);
    const isSelected = userVote === option;
    
    if (variant === "inline" || variant === "mini") {
      return (
        <button
          type="button"
          className={`sentiment-vote-inline-btn vote-${option} ${isSelected ? "is-voted" : ""}`}
          onClick={(e) => { e.stopPropagation(); handleVote(option); }}
          disabled={hasVoted && !isSelected}
          title={label}
        >
          {hasVoted ? (
            <span className="vote-inline-pct">{pct}%</span>
          ) : (
            <span className="vote-inline-icon">{shortLabel}</span>
          )}
        </button>
      );
    }

    return (
      <button
        type="button"
        className={`sentiment-vote-btn vote-${option} ${isSelected ? "is-voted" : ""}`}
        onClick={(e) => { e.stopPropagation(); handleVote(option); }}
        disabled={hasVoted && !isSelected}
        style={{ "--vote-pct": hasVoted ? `${pct}%` : "0%" } as React.CSSProperties}
        aria-label={`Vote ranking should be ${label}`}
      >
        <span className="vote-label">{label}</span>
        {hasVoted && <span className="vote-pct">{pct}%</span>}
      </button>
    );
  };

  if (variant === "inline" || variant === "mini") {
    return (
      <div className={`sentiment-vote-inline-group ${hasVoted ? "has-voted" : ""} variant-${variant}`}>
        {renderVoteButton("higher", "Overrated (Should be lower)", "↓")}
        {renderVoteButton("fair", "Fair (Accurate)", "=")}
        {renderVoteButton("lower", "Underrated (Should be higher)", "↑")}
      </div>
    );
  }

  return (
    <div className="sentiment-vote-panel">
      <div className="sentiment-vote-head">
        <h3>Community sentiment</h3>
        <span>{currentStats.total} votes</span>
      </div>
      <div className="sentiment-vote-actions">
        {renderVoteButton("higher", "Should be higher", "↑")}
        {renderVoteButton("fair", "Seems fair", "=")}
        {renderVoteButton("lower", "Should be lower", "↓")}
      </div>
    </div>
  );
}
