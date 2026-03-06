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
          type="button"
          className="cursor-pointer rounded-[18px] border border-transparent bg-white/90 p-2 text-5xl shadow-[0_18px_36px_-28px_rgba(15,23,42,0.85)] transition-colors hover:border-[#ece8df] hover:bg-[#faf8f4]"
          title="Change icon"
        >
          {icon || "📄"}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-72 border-[#ece8df] bg-white p-3 shadow-xl" align="start">
        <div className="grid grid-cols-8 gap-1">
          {EMOJI_LIST.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => handleSelect(emoji)}
              className="flex h-8 w-8 items-center justify-center rounded-md text-lg transition-colors hover:bg-[#f1efea]"
            >
              {emoji}
            </button>
          ))}
        </div>
        {icon && (
          <div className="mt-2 border-t border-[#efede8] pt-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-xs text-[#787774] hover:bg-[#f1efea] hover:text-[#37352f]"
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
