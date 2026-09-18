"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  NYC_UNIVERSITIES,
  getUniversityById,
} from "@/lib/zima/nycUniversities";
import { ARCHETYPE_BADGES, type ArchetypeId } from "@/lib/archetypes";
import { buildSearchPromptFromFilters } from "@/lib/zima/searchPrompt";
import { jetbrainsMono } from "../../../fonts";

const HOPAMINE_BLUE = "#00a6f3";

const TOGGLE_FILTERS = [
  { id: "organizations", label: "Organizations" },
  { id: "builders", label: "Builders" },
] as const;

type ToggleFilterId = (typeof TOGGLE_FILTERS)[number]["id"];

const MIN_AGE_FLOOR = 18;
const MAX_AGE_CEILING = 99;

const INTEREST_OPTIONS = [
  "Climate",
  "Community",
  "Film & media",
  "Food",
  "Gaming",
  "Music",
  "Fitness",
  "Art & design",
  "Startups",
  "Education",
] as const;

type Props = {
  className?: string;
  /** Under the search field in the grey composer strip. */
  variant?: "default" | "composer";
  idSuffix?: string;
  /** Keeps the search textarea in sync with the active filters. */
  onPromptChange?: (prompt: string) => void;
};

function FilterButton({
  label,
  isOn,
  onClick,
  children,
  ariaExpanded,
  ariaControls,
}: {
  label: string;
  isOn: boolean;
  onClick: () => void;
  children?: ReactNode;
  ariaExpanded?: boolean;
  ariaControls?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isOn}
      aria-expanded={ariaExpanded}
      aria-controls={ariaControls}
      className={`${jetbrainsMono.className} inline-flex h-7 shrink-0 items-center gap-1.5 px-2.5 text-[9px] font-semibold uppercase tracking-wide transition-colors sm:text-[10px] ${
        isOn
          ? "text-white"
          : "bg-neutral-200 text-neutral-800 hover:bg-neutral-300/90"
      }`}
      style={isOn ? { backgroundColor: HOPAMINE_BLUE } : undefined}
    >
      {children}
      <span className="max-w-[9rem] truncate sm:max-w-[11rem]" title={label}>
        {label}
      </span>
    </button>
  );
}

export function ZimaSearchFilters({
  className = "",
  variant = "default",
  idSuffix = "",
  onPromptChange,
}: Props) {
  const [toggles, setToggles] = useState<Set<ToggleFilterId>>(() => new Set());
  const [archetypes, setArchetypes] = useState<Set<ArchetypeId>>(() => new Set());
  const [activeOnly, setActiveOnly] = useState(false);
  const [interests, setInterests] = useState<Set<string>>(() => new Set());
  const [ageRange, setAgeRange] = useState<{ min: number; max: number } | null>(
    null,
  );
  const [ageDraftMin, setAgeDraftMin] = useState(MIN_AGE_FLOOR);
  const [ageDraftMax, setAgeDraftMax] = useState(MAX_AGE_CEILING);
  const [cityNyc, setCityNyc] = useState(true);
  const [universityId, setUniversityId] = useState<string | null>(null);
  const [universityQuery, setUniversityQuery] = useState("");
  const [interestsOpen, setInterestsOpen] = useState(false);
  const [archetypesOpen, setArchetypesOpen] = useState(false);
  const [ageOpen, setAgeOpen] = useState(false);
  const [universityOpen, setUniversityOpen] = useState(false);

  const interestsPanelId = useId();
  const archetypesPanelId = useId();
  const agePanelId = useId();
  const universityPanelId = useId();
  const universitySearchId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const inComposer = variant === "composer";

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      const root = rootRef.current;
      if (!root || root.contains(event.target as Node)) return;
      setInterestsOpen(false);
      setArchetypesOpen(false);
      setAgeOpen(false);
      setUniversityOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  function closeOtherPopovers(
    except?: "age" | "interests" | "archetypes" | "university",
  ) {
    if (except !== "age") setAgeOpen(false);
    if (except !== "interests") setInterestsOpen(false);
    if (except !== "archetypes") setArchetypesOpen(false);
    if (except !== "university") setUniversityOpen(false);
  }

  useEffect(() => {
    if (!onPromptChange) return;
    onPromptChange(
      buildSearchPromptFromFilters({
        toggles,
        archetypes,
        interests,
        activeOnly,
        proximity: null,
        ageRange,
        universityId,
        cityNyc,
      }),
    );
  }, [
    onPromptChange,
    toggles,
    archetypes,
    interests,
    activeOnly,
    ageRange,
    universityId,
    cityNyc,
  ]);

  function clampAge(value: number): number {
    return Math.min(MAX_AGE_CEILING, Math.max(MIN_AGE_FLOOR, value));
  }

  function openAgeModal() {
    closeOtherPopovers("age");
    if (ageRange) {
      setAgeDraftMin(ageRange.min);
      setAgeDraftMax(ageRange.max);
    } else {
      setAgeDraftMin(MIN_AGE_FLOOR);
      setAgeDraftMax(MAX_AGE_CEILING);
    }
    setAgeOpen(true);
  }

  function applyAgeRange() {
    const min = clampAge(ageDraftMin);
    const max = clampAge(Math.max(min, ageDraftMax));
    setAgeRange({ min, max });
    setAgeDraftMin(min);
    setAgeDraftMax(max);
    setAgeOpen(false);
  }

  function clearAgeRange() {
    setAgeRange(null);
    setAgeDraftMin(MIN_AGE_FLOOR);
    setAgeDraftMax(MAX_AGE_CEILING);
    setAgeOpen(false);
  }

  function toggleFilter(id: ToggleFilterId) {
    setToggles((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleInterest(interest: string) {
    setInterests((prev) => {
      const next = new Set(prev);
      if (next.has(interest)) next.delete(interest);
      else next.add(interest);
      return next;
    });
  }

  function toggleArchetype(id: ArchetypeId) {
    setArchetypes((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const interestsOn = interests.size > 0;
  const archetypesOn = archetypes.size > 0;
  const archetypeButtonLabel =
    archetypes.size === 1
      ? (ARCHETYPE_BADGES.find((badge) => badge.id === [...archetypes][0])
          ?.title.replace(/^THE\s+/i, "") ?? "Archetypes")
      : archetypes.size > 1
        ? `Archetypes (${archetypes.size})`
        : "Archetypes";
  const ageOn = ageRange !== null;
  const ageLabel = ageRange ? `${ageRange.min}–${ageRange.max}` : "Age";
  const selectedUniversity = universityId
    ? getUniversityById(universityId)
    : undefined;
  const universityOn = universityId !== null;
  const universityButtonLabel = selectedUniversity?.name ?? "University";

  const universityMatches = NYC_UNIVERSITIES.filter((school) => {
    const q = universityQuery.trim().toLowerCase();
    if (!q) return true;
    return school.name.toLowerCase().includes(q);
  });

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <div
        className={`flex flex-wrap items-center gap-1.5 ${
          inComposer ? "justify-start" : "justify-center sm:justify-start"
        }`}
        role="group"
        aria-label="Search filters"
      >
        <FilterButton
          label="NYC"
          isOn={cityNyc}
          onClick={() => setCityNyc((on) => !on)}
        />

        {TOGGLE_FILTERS.map((filter) => (
          <FilterButton
            key={filter.id}
            label={filter.label}
            isOn={toggles.has(filter.id)}
            onClick={() => toggleFilter(filter.id)}
          />
        ))}

        <div className="relative">
          <FilterButton
            label={ageLabel}
            isOn={ageOn}
            ariaExpanded={ageOpen}
            ariaControls={agePanelId}
            onClick={() => {
              if (ageOpen) {
                setAgeOpen(false);
              } else {
                openAgeModal();
              }
            }}
          />
          {ageOpen ? (
            <div
              id={agePanelId}
              role="dialog"
              aria-label="Age range"
              className="absolute left-0 top-full z-50 mt-1 w-[min(26rem,calc(100vw-2rem))] border border-neutral-300 bg-white p-4 shadow-[0_4px_16px_rgba(0,0,0,0.12)]"
              onMouseDown={(event) => event.stopPropagation()}
            >
              <p
                className={`${jetbrainsMono.className} mb-3 text-[10px] font-semibold uppercase tracking-wide text-neutral-600`}
              >
                Age range
              </p>
              <div className="flex items-center gap-3">
                <label className="flex min-w-0 flex-1 flex-col gap-1">
                  <span
                    className={`${jetbrainsMono.className} text-[9px] font-semibold uppercase tracking-wide text-neutral-500`}
                  >
                    Min
                  </span>
                  <input
                    type="number"
                    min={MIN_AGE_FLOOR}
                    max={MAX_AGE_CEILING}
                    value={ageDraftMin}
                    onChange={(event) => {
                      const next = clampAge(
                        Number.parseInt(event.target.value, 10) ||
                          MIN_AGE_FLOOR,
                      );
                      setAgeDraftMin(next);
                      if (ageDraftMax < next) setAgeDraftMax(next);
                    }}
                    className={`${jetbrainsMono.className} w-full bg-neutral-200 px-2 py-1.5 text-[12px] text-neutral-900 outline-none focus:ring-1 focus:ring-[#00a6f3]`}
                  />
                </label>
                <span
                  className={`${jetbrainsMono.className} mt-4 text-[10px] text-neutral-400`}
                  aria-hidden
                >
                  –
                </span>
                <label className="flex min-w-0 flex-1 flex-col gap-1">
                  <span
                    className={`${jetbrainsMono.className} text-[9px] font-semibold uppercase tracking-wide text-neutral-500`}
                  >
                    Max
                  </span>
                  <input
                    type="number"
                    min={MIN_AGE_FLOOR}
                    max={MAX_AGE_CEILING}
                    value={ageDraftMax}
                    onChange={(event) => {
                      const next = clampAge(
                        Number.parseInt(event.target.value, 10) ||
                          MAX_AGE_CEILING,
                      );
                      setAgeDraftMax(next);
                      if (ageDraftMin > next) setAgeDraftMin(next);
                    }}
                    className={`${jetbrainsMono.className} w-full bg-neutral-200 px-2 py-1.5 text-[12px] text-neutral-900 outline-none focus:ring-1 focus:ring-[#00a6f3]`}
                  />
                </label>
              </div>
              <p
                className={`${jetbrainsMono.className} mt-2 text-[9px] text-neutral-500`}
              >
                Minimum age {MIN_AGE_FLOOR}+
              </p>
              <div className="mt-3 flex gap-1.5">
                <button
                  type="button"
                  onClick={applyAgeRange}
                  className={`${jetbrainsMono.className} flex-1 bg-[#00a6f3] px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-white`}
                >
                  Apply
                </button>
                <button
                  type="button"
                  onClick={clearAgeRange}
                  className={`${jetbrainsMono.className} px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-neutral-600 hover:text-neutral-900`}
                >
                  Clear
                </button>
              </div>
            </div>
          ) : null}
        </div>

        <div className="relative">
          <FilterButton
            label={universityButtonLabel}
            isOn={universityOn}
            ariaExpanded={universityOpen}
            ariaControls={universityPanelId}
            onClick={() => {
              closeOtherPopovers("university");
              setUniversityOpen((open) => {
                if (!open) setUniversityQuery("");
                return !open;
              });
            }}
          />
          {universityOpen ? (
            <div
              id={universityPanelId}
              role="dialog"
              aria-label="Choose university"
              className="absolute left-0 top-full z-50 mt-1 w-[min(32rem,calc(100vw-2rem))] border border-neutral-300 bg-white p-3 shadow-[0_4px_16px_rgba(0,0,0,0.12)]"
              onMouseDown={(event) => event.stopPropagation()}
            >
              <label
                htmlFor={`${universitySearchId}${idSuffix}`}
                className={`${jetbrainsMono.className} mb-2 block text-[10px] font-semibold uppercase tracking-wide text-neutral-600`}
              >
                University
              </label>
              <input
                id={`${universitySearchId}${idSuffix}`}
                type="search"
                value={universityQuery}
                onChange={(event) => setUniversityQuery(event.target.value)}
                placeholder="Search schools…"
                className={`${jetbrainsMono.className} mb-2 w-full bg-neutral-200 px-2 py-1.5 text-[11px] text-neutral-900 outline-none placeholder:text-neutral-500 focus:ring-1 focus:ring-[#00a6f3]`}
              />
              <ul
                className="max-h-48 overflow-y-auto border border-neutral-200"
                role="listbox"
                aria-label="Universities in NYC"
              >
                {universityMatches.length === 0 ? (
                  <li
                    className={`${jetbrainsMono.className} px-3 py-2 text-[10px] text-neutral-500`}
                  >
                    No matches
                  </li>
                ) : (
                  universityMatches.map((school) => {
                    const selected = universityId === school.id;
                    return (
                      <li key={school.id}>
                        <button
                          type="button"
                          role="option"
                          aria-selected={selected}
                          onClick={() => {
                            setUniversityId(school.id);
                            setUniversityOpen(false);
                            setUniversityQuery("");
                          }}
                          className={`${jetbrainsMono.className} block w-full px-3 py-1.5 text-left text-[10px] font-semibold uppercase tracking-wide transition-colors ${
                            selected
                              ? "text-white"
                              : "text-neutral-800 hover:bg-neutral-100"
                          }`}
                          style={
                            selected
                              ? { backgroundColor: HOPAMINE_BLUE }
                              : undefined
                          }
                        >
                          {school.name}
                        </button>
                      </li>
                    );
                  })
                )}
              </ul>
              {universityOn ? (
                <button
                  type="button"
                  onClick={() => {
                    setUniversityId(null);
                    setUniversityOpen(false);
                    setUniversityQuery("");
                  }}
                  className={`${jetbrainsMono.className} mt-2 text-[10px] font-semibold uppercase tracking-wide text-neutral-600 hover:text-neutral-900`}
                >
                  Clear
                </button>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="relative">
          <FilterButton
            label={archetypeButtonLabel}
            isOn={archetypesOn}
            ariaExpanded={archetypesOpen}
            ariaControls={archetypesPanelId}
            onClick={() => {
              closeOtherPopovers("archetypes");
              setArchetypesOpen((open) => !open);
            }}
          />
          {archetypesOpen ? (
            <div
              id={archetypesPanelId}
              role="dialog"
              aria-label="Choose archetypes"
              className="absolute left-0 top-full z-50 mt-1 w-[min(22rem,calc(100vw-2rem))] border border-neutral-300 bg-white p-3 shadow-[0_4px_16px_rgba(0,0,0,0.12)]"
              onMouseDown={(event) => event.stopPropagation()}
            >
              <p
                className={`${jetbrainsMono.className} mb-2 text-[10px] font-semibold uppercase tracking-wide text-neutral-600`}
              >
                Archetypes
              </p>
              <div className="flex max-h-52 flex-col gap-1 overflow-y-auto">
                {ARCHETYPE_BADGES.map((badge) => {
                  const selected = archetypes.has(badge.id);
                  return (
                    <button
                      key={badge.id}
                      type="button"
                      onClick={() => toggleArchetype(badge.id)}
                      aria-pressed={selected}
                      className={`${jetbrainsMono.className} flex w-full items-start gap-2 px-2 py-1.5 text-left text-[10px] font-semibold uppercase tracking-wide transition-colors ${
                        selected
                          ? "text-white"
                          : "bg-neutral-100 text-neutral-800 hover:bg-neutral-200"
                      }`}
                      style={
                        selected ? { backgroundColor: HOPAMINE_BLUE } : undefined
                      }
                    >
                      <span aria-hidden>{badge.emoji}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate">{badge.title}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>

        <div className="relative">
          <FilterButton
            label="Interests"
            isOn={interestsOn}
            ariaExpanded={interestsOpen}
            ariaControls={interestsPanelId}
            onClick={() => {
              closeOtherPopovers("interests");
              setInterestsOpen((open) => !open);
            }}
          />
          {interestsOpen ? (
            <div
              id={interestsPanelId}
              role="dialog"
              aria-label="Choose interests"
              className="absolute left-0 top-full z-50 mt-1 w-[min(18rem,calc(100vw-2rem))] border border-neutral-300 bg-white p-3 shadow-[0_4px_16px_rgba(0,0,0,0.12)]"
            >
              <p
                className={`${jetbrainsMono.className} mb-2 text-[10px] font-semibold uppercase tracking-wide text-neutral-600`}
              >
                Interests
              </p>
              <div className="flex flex-wrap gap-1.5">
                {INTEREST_OPTIONS.map((interest) => {
                  const selected = interests.has(interest);
                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      aria-pressed={selected}
                      className={`${jetbrainsMono.className} px-2 py-1 text-[10px] font-semibold uppercase tracking-wide transition-colors ${
                        selected
                          ? "text-white"
                          : "bg-neutral-200 text-neutral-800 hover:bg-neutral-300/90"
                      }`}
                      style={
                        selected ? { backgroundColor: HOPAMINE_BLUE } : undefined
                      }
                    >
                      {interest}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>

        <FilterButton
          label="Active"
          isOn={activeOnly}
          onClick={() => setActiveOnly((on) => !on)}
        >
          <span
            className={`h-1.5 w-1.5 shrink-0 rounded-full ${
              activeOnly ? "bg-emerald-400" : "bg-emerald-500"
            }`}
            aria-hidden
          />
        </FilterButton>
      </div>
    </div>
  );
}
