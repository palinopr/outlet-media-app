"use client";

import { useState, useRef, useEffect } from "react";
import { Download, FileText, Printer } from "lucide-react";

function exportTablesToCsv() {
  const tables = document.querySelectorAll("table");

  const rows: string[][] = [];

  // Try tables first
  tables.forEach((table) => {
    table.querySelectorAll("tr").forEach((tr) => {
      const cells: string[] = [];
      tr.querySelectorAll("th, td").forEach((cell) => {
        cells.push((cell.textContent ?? "").trim().replace(/,/g, ""));
      });
      if (cells.some((c) => c.length > 0)) rows.push(cells);
    });
  });

  // Fall back to stat cards if no tables
  if (rows.length === 0) {
    const statCards = document.querySelectorAll(".hero-stat-card, .stat-glow, .glass-card");
    const labels: string[] = [];
    const values: string[] = [];
    statCards.forEach((card) => {
      const label = card.querySelector("[class*='uppercase']")?.textContent?.trim();
      const value = card.querySelector("[class*='font-extrabold'], [class*='font-bold']")?.textContent?.trim();
      if (label && value) {
        labels.push(label);
        values.push(value.replace(/,/g, ""));
      }
    });
    if (labels.length > 0) {
      rows.push(labels);
      rows.push(values);
    }
  }

  if (rows.length === 0) return null;

  return rows.map((r) => r.join(",")).join("\n");
}

export function ExportButton() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  function handleCsv() {
    const csv = exportTablesToCsv();
    if (!csv) return;
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `outlet-media-export-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setOpen(false);
  }

  function handlePrint() {
    window.print();
    setOpen(false);
  }

  return (
    <div className="relative print:hidden" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-white/50 hover:text-white/80 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] transition-all"
      >
        <Download className="h-3.5 w-3.5" />
        Export
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-40 rounded-lg border border-white/[0.08] bg-[oklch(0.14_0_0)] shadow-xl z-50 overflow-hidden">
          <button
            onClick={handleCsv}
            className="flex items-center gap-2 w-full px-3 py-2.5 text-xs text-white/70 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <FileText className="h-3.5 w-3.5" />
            Download CSV
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 w-full px-3 py-2.5 text-xs text-white/70 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <Printer className="h-3.5 w-3.5" />
            Print / PDF
          </button>
        </div>
      )}
    </div>
  );
}
