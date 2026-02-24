"use client";

import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface Props {
  data: { date: string; sold: number }[];
}

function Tip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-zinc-900 border border-white/10 rounded px-2 py-1 text-[10px] shadow-lg">
      <p className="text-white/50">{label}</p>
      <p className="text-white font-semibold">
        {payload[0].value.toLocaleString()} sold
      </p>
    </div>
  );
}

export function TicketSparkline({ data }: Props) {
  if (data.length < 2) return null;

  return (
    <ResponsiveContainer width="100%" height={48}>
      <AreaChart data={data} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.25} />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
          </linearGradient>
        </defs>
        <Tooltip content={<Tip />} />
        <Area
          type="monotone"
          dataKey="sold"
          stroke="#06b6d4"
          fill="url(#sparkFill)"
          strokeWidth={1.5}
          dot={false}
          activeDot={{ r: 2, fill: "#06b6d4" }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
