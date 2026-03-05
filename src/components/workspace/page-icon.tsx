"use client";

import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

const EMOJI_LIST = [
  "📄", "📝", "📋", "📌", "📎", "📊", "📈", "📉",
  "💡", "🎯", "🚀", "⭐", "🔥", "💎", "🎨", "🎬",
  "📸", "🎵", "🎤", "🎧", "📢", "📣", "💬", "💭",
  "✅", "❌", "⚠️", "❗", "❓", "🔔", "🔑", "🔒",
  "📅", "⏰", "🌍", "🏠", "🏢", "👥", "👤", "💼",
  "📱", "💻", "🖥️", "⚙️", "🔧", "🛠️", "📦", "🗂️",
];

interface PageIconProps {
  pageId: string;
  currentIcon: string | null;
  onSave?: (icon: string | null) => void;
}

export function PageIcon({ pageId, currentIcon, onSave }: PageIconProps) {
  const [open, setOpen] = useState(false);
  const [icon, setIcon] = useState(currentIcon);

  const handleSelect = async (emoji: string | null) => {
    setIcon(emoji);
    setOpen(false);
    await fetch(`/api/workspace/pages/${pageId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ icon: emoji }),
    });
    onSave?.(emoji);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className="text-4xl hover:bg-muted/50 rounded-lg p-1 transition-colors cursor-pointer"
          title="Change icon"
        >
          {icon || "📄"}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-3" align="start">
        <div className="grid grid-cols-8 gap-1">
          {EMOJI_LIST.map((emoji) => (
            <button
              key={emoji}
              onClick={() => handleSelect(emoji)}
              className="h-8 w-8 flex items-center justify-center rounded hover:bg-muted transition-colors text-lg"
            >
              {emoji}
            </button>
          ))}
        </div>
        {icon && (
          <div className="mt-2 pt-2 border-t">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs"
              onClick={() => handleSelect(null)}
            >
              Remove icon
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
