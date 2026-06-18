type BrandMarkProps = {
  onClick: () => void;
};

export function BrandMark({ onClick }: BrandMarkProps) {
  return (
    <button
      type="button"
      className="category-brand-button"
      onClick={onClick}
      aria-label="Back to Industry Rankings"
    >
      <span className="category-brand-logo" aria-hidden="true">
        <svg viewBox="0 0 96 96" role="img" focusable="false">
          <defs>
            <linearGradient id="brandMarkBg" x1="16" y1="10" x2="84" y2="90">
              <stop offset="0" stopColor="#384346" />
              <stop offset="0.58" stopColor="#242d30" />
              <stop offset="1" stopColor="#171d20" />
            </linearGradient>
            <linearGradient id="brandMarkSignal" x1="20" y1="72" x2="74" y2="28">
              <stop offset="0" stopColor="#dfe7e4" />
              <stop offset="1" stopColor="#7fb8d5" />
            </linearGradient>
            <filter id="brandMarkGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="2.4" floodColor="#9fd3e8" floodOpacity="0.28" />
            </filter>
          </defs>

          <rect x="5" y="5" width="86" height="86" rx="21" fill="url(#brandMarkBg)" />
          <rect x="9" y="9" width="78" height="78" rx="17" fill="none" stroke="rgba(255,255,255,0.13)" strokeWidth="2" />
          <path d="M22 76V24M36 76V32M50 76V42M64 76V54" stroke="rgba(255,255,255,0.07)" strokeWidth="1.5" />
          <rect x="56" y="62" width="6" height="14" rx="2" fill="rgba(255,255,255,0.42)" />
          <rect x="66" y="54" width="6" height="22" rx="2" fill="rgba(255,255,255,0.58)" />
          <rect x="76" y="45" width="6" height="31" rx="2" fill="rgba(255,255,255,0.76)" />

          <path d="M47 64L59 52L68 55L81 34" fill="none" stroke="url(#brandMarkSignal)" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" filter="url(#brandMarkGlow)" />
          <path d="M75 34H82V41" fill="none" stroke="#dfe7e4" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

          <path d="M58 22L67 17L77 22V32L67 38L58 32V22Z" fill="none" stroke="rgba(159,211,232,0.58)" strokeWidth="2" />
          <circle cx="58" cy="22" r="2.8" fill="#9fd3e8" />
          <circle cx="67" cy="17" r="2.8" fill="#dfe7e4" />
          <circle cx="77" cy="22" r="2.8" fill="#9fd3e8" />
          <circle cx="67" cy="38" r="2.8" fill="#dfe7e4" />

          <text x="19" y="56" fill="#ffffff" fontFamily="Georgia, 'Times New Roman', serif" fontSize="29" fontWeight="700" letterSpacing="-1.5">
            RI
          </text>
        </svg>
      </span>
      <span className="category-brand-copy">
        <strong>Rank Intelligence</strong>
        <em>AI company ranking terminal</em>
      </span>
    </button>
  );
}
