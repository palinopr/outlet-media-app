"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import type { MentionUser } from "@/lib/workspace-types";

interface MentionComboboxProps {
  query: string;
  clientSlug?: string;
  onSelect: (user: MentionUser) => void;
  position?: { top: number; left: number };
}

export function MentionCombobox({ query, clientSlug, onSelect, position }: MentionComboboxProps) {
  const [users, setUsers] = useState<MentionUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  const fetchUsers = useCallback(async (q: string) => {
    if (q.length < 1) {
      setUsers([]);
      return;
    }
    setLoading(true);
    try {
      const params = new URLSearchParams({ q });
      if (clientSlug) params.set("client_slug", clientSlug);
      const res = await fetch(`/api/workspace/mentions?${params}`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users ?? []);
        setSelectedIndex(0);
      }
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [clientSlug]);

  useEffect(() => {
    const timer = setTimeout(() => fetchUsers(query), 200);
    return () => clearTimeout(timer);
  }, [query, fetchUsers]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (users.length === 0) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, users.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        onSelect(users[selectedIndex]);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [users, selectedIndex, onSelect]);

  if (users.length === 0 && !loading) return null;

  const style = position
    ? { position: "absolute" as const, top: position.top, left: position.left }
    : {};

  return (
    <div
      ref={listRef}
      style={style}
      className="z-50 w-64 rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
    >
      {loading && (
        <div className="px-3 py-2 text-xs text-muted-foreground">Searching...</div>
      )}
      {users.map((user, i) => (
        <button
          key={user.id}
          type="button"
          className={`flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm ${
            i === selectedIndex ? "bg-accent text-accent-foreground" : "hover:bg-accent/50"
          }`}
          onMouseDown={(e) => {
            e.preventDefault();
            onSelect(user);
          }}
          onMouseEnter={() => setSelectedIndex(i)}
        >
          <Avatar size="sm">
            {user.imageUrl && <AvatarImage src={user.imageUrl} alt={user.name} />}
            <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 text-left">
            <p className="truncate font-medium">{user.name}</p>
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          </div>
        </button>
      ))}
    </div>
  );
}
