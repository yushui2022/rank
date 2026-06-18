import { useEffect, useMemo, useState } from "react";
import {
  linkedinCompanyPeopleSearchUrl,
  linkedinCompanySearchUrl,
} from "../../data/companyPeople";
import type { CompanyPersonProfile } from "../../types/companyPeople";
import type { Entity } from "../../types/rankings";

type CompanyPeopleNetworkProps = {
  entity: Entity;
  people: CompanyPersonProfile[];
};

const initialsForPerson = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const linkLabelFor = (person: CompanyPersonProfile) =>
  person.linkStatus === "verified-profile" ? "Open LinkedIn profile" : "Search on LinkedIn";

const statusLabelFor = (person: CompanyPersonProfile) => {
  if (person.linkStatus === "verified-profile") return "Verified profile";
  if (person.linkStatus === "needs-verification") return "Needs verification";
  return "LinkedIn search";
};

function PeopleResearchFallback({ entity }: { entity: Entity }) {
  const searches = [
    {
      label: "Leadership search",
      detail: "CEO, founder, executive team",
      href: linkedinCompanyPeopleSearchUrl(entity.name, "CEO founder leadership"),
    },
    {
      label: "Engineering search",
      detail: "AI research, ML systems, infrastructure",
      href: linkedinCompanyPeopleSearchUrl(entity.name, "AI research machine learning engineering"),
    },
    {
      label: "Product search",
      detail: "AI product, platform, enterprise GTM",
      href: linkedinCompanyPeopleSearchUrl(entity.name, "AI product platform enterprise"),
    },
  ];

  return (
    <div className="company-people-empty">
      <p>
        Curated people profiles are pending for this company. Use the research links below
        to inspect leadership and engineering signals on LinkedIn.
      </p>
      <div className="company-people-searches">
        {searches.map((search) => (
          <a key={search.label} href={search.href} target="_blank" rel="noreferrer">
            <span>{search.label}</span>
            <strong>{search.detail}</strong>
          </a>
        ))}
      </div>
    </div>
  );
}

export function CompanyPeopleNetwork({ entity, people }: CompanyPeopleNetworkProps) {
  const [selectedId, setSelectedId] = useState(people[0]?.id ?? "");

  useEffect(() => {
    setSelectedId(people[0]?.id ?? "");
  }, [entity.id, people]);

  const selectedPerson = useMemo(
    () => people.find((person) => person.id === selectedId) ?? people[0] ?? null,
    [people, selectedId],
  );

  const companySearchUrl = linkedinCompanySearchUrl(entity.name);

  return (
    <article className="company-section company-people-section">
      <div className="company-section-head compact">
        <span>People network</span>
        <strong>{people.length > 0 ? `${people.length} profiles` : "Research"}</strong>
      </div>

      <div className="company-people-actions">
        <a href={companySearchUrl} target="_blank" rel="noreferrer">
          Company LinkedIn
        </a>
        <a
          href={linkedinCompanyPeopleSearchUrl(entity.name)}
          target="_blank"
          rel="noreferrer"
        >
          People search
        </a>
      </div>

      {people.length === 0 ? (
        <PeopleResearchFallback entity={entity} />
      ) : (
        <div className="company-people-layout">
          <div className="company-people-list" aria-label={`${entity.name} people profiles`}>
            {people.map((person) => (
              <button
                key={person.id}
                type="button"
                className={person.id === selectedPerson?.id ? "is-selected" : ""}
                onClick={() => setSelectedId(person.id)}
              >
                <span className="company-person-avatar" aria-hidden="true">
                  {initialsForPerson(person.name)}
                </span>
                <span className="company-person-copy">
                  <strong>{person.name}</strong>
                  <em>{person.role}</em>
                </span>
              </button>
            ))}
          </div>

          {selectedPerson ? (
            <aside className="company-person-panel">
              <div className="company-person-panel-head">
                <span className="company-person-avatar large" aria-hidden="true">
                  {initialsForPerson(selectedPerson.name)}
                </span>
                <div>
                  <strong>{selectedPerson.name}</strong>
                  <em>{selectedPerson.role}</em>
                  {selectedPerson.location ? <small>{selectedPerson.location}</small> : null}
                </div>
              </div>

              <p>{selectedPerson.profileSummary}</p>
              <dl>
                <div>
                  <dt>Focus</dt>
                  <dd>{selectedPerson.focus}</dd>
                </div>
                <div>
                  <dt>Link status</dt>
                  <dd>{statusLabelFor(selectedPerson)}</dd>
                </div>
              </dl>

              <div className="company-person-signals">
                {selectedPerson.signals.map((signal) => (
                  <span key={signal}>{signal}</span>
                ))}
              </div>

              <a
                className="company-person-link"
                href={selectedPerson.linkedinUrl ?? selectedPerson.linkedinSearchUrl}
                target="_blank"
                rel="noreferrer"
              >
                {linkLabelFor(selectedPerson)}
              </a>
            </aside>
          ) : null}
        </div>
      )}
    </article>
  );
}
