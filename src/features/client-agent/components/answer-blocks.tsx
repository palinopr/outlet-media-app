"use client";

import type { AgentAnswerBlock } from "../types";

type AnswerBlocksProps = {
  blocks: AgentAnswerBlock[];
};

export function AnswerBlocks({ blocks }: AnswerBlocksProps) {
  return (
    <div className="space-y-3">
      {blocks.map((block, index) => {
        if (block.type === "metric_cards") {
          return (
            <section
              key={`metric_cards_${index}`}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4"
            >
              {block.title ? (
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/45">
                  {block.title}
                </p>
              ) : null}
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {block.cards.map((card) => (
                  <div
                    key={`${card.label}_${card.value}`}
                    className="rounded-2xl border border-white/[0.06] bg-black/20 p-3"
                  >
                    <p className="text-xs uppercase tracking-[0.18em] text-white/40">
                      {card.label}
                    </p>
                    <p className="mt-2 text-xl font-semibold text-white">{card.value}</p>
                  </div>
                ))}
              </div>
            </section>
          );
        }

        if (block.type === "table") {
          return (
            <section
              key={`table_${index}`}
              className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03]"
            >
              {block.title ? (
                <p className="border-b border-white/[0.08] px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/45">
                  {block.title}
                </p>
              ) : null}
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-white/[0.03] text-white/50">
                    <tr>
                      {block.columns.map((column) => (
                        <th key={column} className="px-4 py-3 font-medium">
                          {column}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, rowIndex) => (
                      <tr key={`row_${rowIndex}`} className="border-t border-white/[0.06] text-white/80">
                        {block.columns.map((column) => (
                          <td key={`${column}_${rowIndex}`} className="px-4 py-3">
                            {row[column] == null ? "—" : String(row[column])}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          );
        }

        return (
          <section
            key={`chart_${index}`}
            data-testid="answer-chart"
            className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4"
          >
            {block.title ? (
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/45">
                {block.title}
              </p>
            ) : null}
            <div className="space-y-2">
              {block.series.map((series) => (
                <div key={series.name}>
                  <p className="text-sm font-medium text-white/75">{series.name}</p>
                  <div className="mt-2 space-y-2">
                    {series.points.slice(0, 8).map((point) => (
                      <div key={`${series.name}_${point.x}`} className="grid grid-cols-[84px_minmax(0,1fr)_56px] items-center gap-3 text-xs text-white/55">
                        <span>{point.x}</span>
                        <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                          <div
                            className="h-full rounded-full bg-cyan-300/70"
                            style={{
                              width: `${Math.max(6, Math.min(100, Math.round((point.y ?? 0) / 5)))}%`,
                            }}
                          />
                        </div>
                        <span className="text-right">{point.y ?? "—"}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
