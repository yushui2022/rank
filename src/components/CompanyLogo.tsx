import { useEffect, useMemo, useState } from "react";
import type { Entity } from "../types/rankings";

type CompanyLogoProps = {
  entity: Entity;
  size?: "default" | "large";
};

const initialsFor = (entity: Entity) =>
  (entity.logoText || entity.name)
    .split(/\s+|\/|-/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();

const hostnameFromWebsite = (website: string) => {
  try {
    const url = new URL(website.startsWith("http") ? website : `https://${website}`);
    return url.hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
};

export function CompanyLogo({ entity, size = "default" }: CompanyLogoProps) {
  const candidates = useMemo(() => {
    const hostname = hostnameFromWebsite(entity.website);
    if (!hostname) return [];

    return [
      `https://www.google.com/s2/favicons?sz=128&domain=${encodeURIComponent(hostname)}`,
      `https://icons.duckduckgo.com/ip3/${hostname}.ico`,
      `https://logo.clearbit.com/${hostname}`,
    ];
  }, [entity.website]);

  const [candidateIndex, setCandidateIndex] = useState(0);

  useEffect(() => {
    setCandidateIndex(0);
  }, [entity.id, candidates.length]);

  const src = candidates[candidateIndex];
  const fallbackText = initialsFor(entity);
  const className = [
    "entity-logo",
    "company-logo",
    size === "large" ? "large" : "",
    src ? "has-image" : "is-fallback",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={className} title={entity.name} aria-label={`${entity.name} logo`}>
      {src ? (
        <img
          src={src}
          alt=""
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setCandidateIndex((current) => current + 1)}
        />
      ) : (
        <span>{fallbackText}</span>
      )}
    </span>
  );
}
