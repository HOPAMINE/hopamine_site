"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
// University filter — hidden for now
// import {
//   NYC_UNIVERSITIES,
//   getUniversityById,
// } from "@/lib/zima/nycUniversities";
import { ARCHETYPE_OPTIONS, type ArchetypeId } from "@/lib/archetypes";
import { buildSearchPromptFromFilters } from "@/lib/zima/searchPrompt";
import { jetbrainsMono } from "../../../fonts";

const HOPAMINE_BLUE = "#00a6f3";

type ToggleFilterId = "builders";

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

const ORGANIZATION_OPTIONS = [
  "Civic",
  "Community",
  "Startups",
  "Accelerators",
  "Climate",
  "Open source",
  "Education",
  "Nonprofit",
  "Research",
  "Arts & culture",
  "Government",
  "Venture",
] as const;

const FILTER_CHECKBOX_PX = 20;
const FILTER_CHECKMARK_PX = 14;
const FILTER_CHECKBOX_OFF = "#D9D9D9";

function FilterCheckboxBox({ isOn }: { isOn: boolean }) {
  return (
    <span
      aria-hidden
      className="inline-flex flex-none items-center justify-center rounded-none"
      style={{
        width: FILTER_CHECKBOX_PX,
        height: FILTER_CHECKBOX_PX,
        minWidth: FILTER_CHECKBOX_PX,
        minHeight: FILTER_CHECKBOX_PX,
        backgroundColor: isOn ? HOPAMINE_BLUE : FILTER_CHECKBOX_OFF,
        boxShadow: isOn
          ? undefined
          : "inset 0 0 0 1px rgba(0, 0, 0, 0.18)",
      }}
    >
      {isOn ? (
        <svg
          viewBox="0 0 12 12"
          width={FILTER_CHECKMARK_PX}
          height={FILTER_CHECKMARK_PX}
          className="block shrink-0"
          fill="none"
          stroke="white"
          strokeWidth="1.75"
          strokeLinecap="square"
        >
          <path d="M2.5 6l2.5 2.5L9.5 4" />
        </svg>
      ) : null}
    </span>
  );
}

function FilterCheckbox({
  label,
  isOn,
  onClick,
  children,
  ariaExpanded,
  ariaControls,
  opensPopover = false,
  className = "",
}: {
  label: string;
  isOn: boolean;
  onClick: () => void;
  children?: ReactNode;
  ariaExpanded?: boolean;
  ariaControls?: string;
  opensPopover?: boolean;
  className?: string;
}) {
  const inputId = useId();
  const rowClass = `${jetbrainsMono.className} inline-flex h-8 shrink-0 cursor-pointer items-center gap-2.5 bg-transparent px-1 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-neutral-800 sm:text-[12px] ${className}`;
  const labelClass =
    className.includes("w-full")
      ? "min-w-0 flex-1 truncate"
      : "max-w-[12rem] truncate sm:max-w-[15rem]";
  if (opensPopover) {
    return (
      <span
        role="button"
        tabIndex={0}
        aria-expanded={ariaExpanded}
        aria-controls={ariaControls}
        className={rowClass}
        onClick={() => onClick()}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onClick();
          }
        }}
      >
        <input
          type="checkbox"
          checked={isOn}
          readOnly
          tabIndex={-1}
          aria-hidden
          className="hidden"
        />
        <FilterCheckboxBox isOn={isOn} />
        {children}
        <span className={labelClass} title={label}>
          {label}
        </span>
      </span>
    );
  }

  return (
    <label htmlFor={inputId} className={rowClass}>
      <input
        id={inputId}
        type="checkbox"
        checked={isOn}
        onChange={() => onClick()}
        className="hidden"
      />
      <FilterCheckboxBox isOn={isOn} />
      {children}
      <span className={labelClass} title={label}>
        {label}
      </span>
    </label>
  );
}

type Props = {
  className?: string;
  /** Under the search field in the grey composer strip. */
  variant?: "default" | "composer";
  idSuffix?: string;
  /** Keeps the search textarea in sync with the active filters. */
  onPromptChange?: (prompt: string) => void;
};

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
  const [organizationTypes, setOrganizationTypes] = useState<Set<string>>(
    () => new Set(),
  );
  const cityNyc = true;
  // const [universityId, setUniversityId] = useState<string | null>(null);
  // const [universityQuery, setUniversityQuery] = useState("");
  const [interestsOpen, setInterestsOpen] = useState(false);
  const [organizationsOpen, setOrganizationsOpen] = useState(false);
  const [archetypesOpen, setArchetypesOpen] = useState(false);
  // const [universityOpen, setUniversityOpen] = useState(false);

  const interestsPanelId = useId();
  const organizationsPanelId = useId();
  const archetypesPanelId = useId();
  // const universityPanelId = useId();
  // const universitySearchId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const inComposer = variant === "composer";

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      const root = rootRef.current;
      if (!root || root.contains(event.target as Node)) return;
      setInterestsOpen(false);
      setOrganizationsOpen(false);
      setArchetypesOpen(false);
      // setUniversityOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  function closeOtherPopovers(
    except?: "interests" | "organizations" | "archetypes",
  ) {
    if (except !== "interests") setInterestsOpen(false);
    if (except !== "organizations") setOrganizationsOpen(false);
    if (except !== "archetypes") setArchetypesOpen(false);
    // if (except !== "university") setUniversityOpen(false);
  }

  useEffect(() => {
    if (!onPromptChange) return;
    onPromptChange(
      buildSearchPromptFromFilters({
        toggles,
        archetypes,
        interests,
        organizationTypes,
        activeOnly,
        proximity: null,
        universityId: null,
        cityNyc,
      }),
    );
  }, [
    onPromptChange,
    toggles,
    archetypes,
    interests,
    organizationTypes,
    activeOnly,
    cityNyc,
  ]);

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

  function toggleOrganizationType(option: string) {
    setOrganizationTypes((prev) => {
      const next = new Set(prev);
      if (next.has(option)) next.delete(option);
      else next.add(option);
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
  const organizationsOn = organizationTypes.size > 0;
  const archetypesOn = archetypes.size > 0;
  const archetypeButtonLabel =
    archetypes.size === 1
      ? (ARCHETYPE_OPTIONS.find((option) => option.id === [...archetypes][0])
          ?.label ?? "Archetypes")
      : archetypes.size > 1
        ? `Archetypes (${archetypes.size})`
        : "Archetypes";
  // const selectedUniversity = universityId
  //   ? getUniversityById(universityId)
  //   : undefined;
  // const universityOn = universityId !== null;
  // const universityButtonLabel = selectedUniversity?.name ?? "University";
  //
  // const universityMatches = NYC_UNIVERSITIES.filter((school) => {
  //   const q = universityQuery.trim().toLowerCase();
  //   if (!q) return true;
  //   return school.name.toLowerCase().includes(q);
  // });

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <div
        className={`flex flex-wrap items-center gap-1.5 ${
          inComposer ? "justify-start" : "justify-center sm:justify-start"
        }`}
        role="group"
        aria-label="Search filters"
      >
        <span
          className={`${jetbrainsMono.className} inline-flex h-8 shrink-0 items-center px-1 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-neutral-800 sm:text-[12px]`}
        >
          Location: NYC
        </span>

        <div className="relative">
          <FilterCheckbox
            label="Organizations"
            isOn={organizationsOn}
            opensPopover
            ariaExpanded={organizationsOpen}
            ariaControls={organizationsPanelId}
            onClick={() => {
              closeOtherPopovers("organizations");
              setOrganizationsOpen((open) => !open);
            }}
          />
          {organizationsOpen ? (
            <div
              id={organizationsPanelId}
              role="dialog"
              aria-label="Choose organization types"
              className="absolute left-0 top-full z-50 mt-1 w-[min(18rem,calc(100vw-2rem))] border border-neutral-300 bg-white p-3 shadow-[0_4px_16px_rgba(0,0,0,0.12)]"
              onMouseDown={(event) => event.stopPropagation()}
            >
              <p
                className={`${jetbrainsMono.className} mb-2 text-[10px] font-semibold uppercase tracking-wide text-neutral-600`}
              >
                Organizations
              </p>
              <div className="flex flex-wrap gap-1.5">
                {ORGANIZATION_OPTIONS.map((option) => {
                  const selected = organizationTypes.has(option);
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => toggleOrganizationType(option)}
                      aria-pressed={selected}
                      className={`${jetbrainsMono.className} px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wide transition-colors sm:text-[12px] ${
                        selected
                          ? "text-white"
                          : "bg-neutral-200 text-neutral-800 hover:bg-neutral-300/90"
                      }`}
                      style={
                        selected ? { backgroundColor: HOPAMINE_BLUE } : undefined
                      }
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>

        <FilterCheckbox
          label="Builders"
          isOn={toggles.has("builders")}
          onClick={() => toggleFilter("builders")}
        />

        {/* University filter — hidden for now (state, import, and popover commented above). */}

        <div className="relative">
          <FilterCheckbox
            label={archetypeButtonLabel}
            isOn={archetypesOn}
            opensPopover
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
              className="absolute left-0 top-full z-50 mt-1 w-[min(28rem,calc(100vw-2rem))] border border-neutral-300 bg-white p-3 shadow-[0_4px_16px_rgba(0,0,0,0.12)]"
              onMouseDown={(event) => event.stopPropagation()}
            >
              <p
                className={`${jetbrainsMono.className} mb-2 text-[10px] font-semibold uppercase tracking-wide text-neutral-600`}
              >
                Archetypes
              </p>
              <div className="grid max-h-52 grid-cols-2 gap-x-3 gap-y-0.5 overflow-y-auto">
                {ARCHETYPE_OPTIONS.map((option) => (
                  <FilterCheckbox
                    key={option.id}
                    className="w-full"
                    label={option.label}
                    isOn={archetypes.has(option.id)}
                    onClick={() => toggleArchetype(option.id)}
                  />
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div className="relative">
          <FilterCheckbox
            label="Interests"
            isOn={interestsOn}
            opensPopover
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
                      className={`${jetbrainsMono.className} px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wide transition-colors sm:text-[12px] ${
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

        <FilterCheckbox
          label="Active"
          isOn={activeOnly}
          onClick={() => setActiveOnly((on) => !on)}
        />
      </div>
    </div>
  );
}
