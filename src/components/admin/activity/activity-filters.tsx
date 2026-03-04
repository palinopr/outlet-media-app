"use client";

import { useQueryState, parseAsString } from "nuqs";

interface Props {
  users: string[];
}

const EVENT_TYPES = [
  { value: "all", label: "All types" },
  { value: "page_view", label: "Page views" },
  { value: "action", label: "Actions" },
  { value: "error", label: "Errors" },
  { value: "session_start", label: "Sessions" },
];

const DATE_RANGES = [
  { value: "today", label: "Today" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
];

export function ActivityFilters({ users }: Props) {
  const opts = { shallow: false } as const;

  const [user, setUser] = useQueryState(
    "user",
    parseAsString.withDefault("all").withOptions(opts),
  );
  const [type, setType] = useQueryState(
    "type",
    parseAsString.withDefault("all").withOptions(opts),
  );
  const [range, setRange] = useQueryState(
    "range",
    parseAsString.withDefault("7d").withOptions(opts),
  );

  const selectClass =
    "text-xs bg-background border border-border/60 rounded px-2.5 py-1.5 text-foreground focus:outline-none focus:ring-1 focus:ring-ring";

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <select
        value={user}
        onChange={(e) => {
          const v = e.target.value;
          setUser(v === "all" ? null : v);
        }}
        className={selectClass}
      >
        <option value="all">All users</option>
        {users.map((email) => (
          <option key={email} value={email}>
            {email}
          </option>
        ))}
      </select>

      <select
        value={type}
        onChange={(e) => {
          const v = e.target.value;
          setType(v === "all" ? null : v);
        }}
        className={selectClass}
      >
        {EVENT_TYPES.map((t) => (
          <option key={t.value} value={t.value}>
            {t.label}
          </option>
        ))}
      </select>

      <select
        value={range}
        onChange={(e) => {
          const v = e.target.value;
          setRange(v === "7d" ? null : v);
        }}
        className={selectClass}
      >
        {DATE_RANGES.map((r) => (
          <option key={r.value} value={r.value}>
            {r.label}
          </option>
        ))}
      </select>
    </div>
  );
}
