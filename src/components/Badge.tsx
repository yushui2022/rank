type BadgeProps = {
  children: string;
  tone?: "blue" | "green" | "amber" | "red" | "neutral";
};

export function Badge({ children, tone = "neutral" }: BadgeProps) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}
