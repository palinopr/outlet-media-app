"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { PlateElementProps } from "platejs/react";
import type { TComboboxInputElement } from "platejs";
import { PlateElement, useEditorRef, useElement } from "platejs/react";
import { useComboboxInput } from "@platejs/combobox/react";
import { MentionPlugin } from "@platejs/mention/react";
import type { MentionUser } from "@/lib/workspace-types";

export function MentionInputElement(
  props: PlateElementProps<TComboboxInputElement>
) {
  const { children, element, ...rest } = props;
  const editor = useEditorRef();
  const inputRef = useRef<HTMLSpanElement>(null);
  const [users, setUsers] = useState<MentionUser[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const { props: comboboxProps, removeInput } = useComboboxInput({
    ref: inputRef,
    cancelInputOnBlur: true,
    cancelInputOnEscape: true,
    cancelInputOnBackspace: true,
    onCancelInput: () => {},
  });

  const query = element.value ?? "";

  const fetchUsers = useCallback(async (q: string) => {
    if (q.length < 1) {
      setUsers([]);
      return;
    }
    try {
      const res = await fetch(
        `/api/workspace/mentions?q=${encodeURIComponent(q)}`
      );
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users ?? []);
        setSelectedIndex(0);
      }
    } catch {
      setUsers([]);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => fetchUsers(query), 200);
    return () => clearTimeout(timer);
  }, [query, fetchUsers]);

  const selectUser = (user: MentionUser) => {
    removeInput(true);
    editor.tf.insertNodes(
      {
        type: MentionPlugin.key,
        value: user.name,
        id: user.id,
        children: [{ text: "" }],
      },
      { select: true }
    );
    editor.tf.move();
  };

  return (
    <PlateElement {...rest} element={element}>
      <span>
        <span className="text-blue-400" contentEditable={false}>
          @
        </span>
        <span ref={inputRef} {...comboboxProps}>
          {children}
        </span>
        {(users.length > 0 || query.length > 0) && (
          <div
            className="absolute z-50 mt-1 w-64 rounded-lg border border-white/[0.08] bg-[oklch(0.14_0_0)] shadow-xl shadow-black/30 overflow-hidden"
            contentEditable={false}
          >
            <div className="py-1">
              {users.length === 0 && query.length > 0 && (
                <div className="px-3 py-2 text-xs text-white/30">
                  No users found
                </div>
              )}
              {users.map((user, index) => (
                <button
                  key={user.id}
                  type="button"
                  className={`flex w-full items-center gap-2 px-3 py-1.5 text-left transition-colors ${
                    index === selectedIndex
                      ? "bg-white/[0.06] text-white"
                      : "text-white/60 hover:bg-white/[0.04]"
                  }`}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    selectUser(user);
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div className="h-6 w-6 rounded-full bg-white/[0.08] flex items-center justify-center text-xs font-medium text-white/60">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{user.name}</p>
                    <p className="text-xs text-white/30 truncate">
                      {user.email}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </span>
    </PlateElement>
  );
}
