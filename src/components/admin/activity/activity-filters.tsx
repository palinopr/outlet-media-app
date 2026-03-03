"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

interface Props {
  users: string[];
  selectedUser: string;
  selectedType: string;
  selectedRange: string;
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

export function ActivityFilters({ users, selectedUser, selectedType, selectedRange }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all" || !value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  const selectClass =
    "text-xs bg-background border border-border/60 rounded px-2.5 py-1.5 text-foreground focus:outline-none focus:ring-1 focus:ring-ring";

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <select
        value={selectedUser}
        onChange={(e) => setParam("user", e.target.value)}
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
        value={selectedType}
        onChange={(e) => setParam("type", e.target.value)}
        className={selectClass}
      >
        {EVENT_TYPES.map((t) => (
          <option key={t.value} value={t.value}>
            {t.label}
          </option>
        ))}
      </select>

      <select
        value={selectedRange}
        onChange={(e) => setParam("range", e.target.value)}
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
