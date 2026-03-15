"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Sparkles, Bot, ChevronDown } from "lucide-react";
import type { MetaCampaignCard } from "@/lib/meta-campaigns";
import { fmtUsd } from "@/lib/formatters";

interface Props {
    campaign: MetaCampaignCard;
}

const mockTimelineData = [
    { date: "Jan 13", spend: 10, revenue: 15, roas: 1.5 },
    { date: "Feb 15", spend: 20, revenue: 35, roas: 1.75 },
    { date: "Mar 20", spend: 15, revenue: 40, roas: 2.6 },
    { date: "Apr 25", spend: 40, revenue: 90, roas: 2.25 },
    { date: "May 10", spend: 60, revenue: 110, roas: 1.83 },
    { date: "Jun 18", spend: 50, revenue: 140, roas: 2.8 },
    { date: "Jul 22", spend: 80, revenue: 200, roas: 2.5 },
    { date: "Aug 23", spend: 120, revenue: 320, roas: 2.66 },
    { date: "Sep 15", spend: 110, revenue: 350, roas: 3.18 },
    { date: "Oct 20", spend: 140, revenue: 450, roas: 3.21 },
    { date: "Nov 25", spend: 180, revenue: 600, roas: 3.33 },
    { date: "Dec 28", spend: 90, revenue: 250, roas: 2.77 },
];

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const hours = Array.from({ length: 24 }, (_, i) => i);

function seededRandom(seed: number) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

const heatmapData = days.map((_, dIdx) =>
    hours.map((_, hIdx) => Math.floor(seededRandom(dIdx * 24 + hIdx + 42) * 100))
);

export function CampaignDetailDashboard({ campaign }: Props) {

    return (
        <div className="space-y-6">
            {/* Target Brief */}
            <div className="relative overflow-hidden rounded-[20px] bg-gradient-to-br from-[#0f2122] via-[#112a2a] to-[#1c1815] p-6 sm:p-8 shadow-sm">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#2c4c47] to-transparent opacity-20 pointer-events-none" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="max-w-2xl space-y-3">
                        <h2 className="text-2xl sm:text-3xl font-serif text-white opacity-90">Campaign Intelligence Brief</h2>
                        <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                            The Barcelona campaign is seeing exceptional engagement, driving a significant ROAS increase
                            thanks to optimized weekend scheduling and highly relevant audience targeting.
                        </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <p className="text-sm font-medium text-emerald-400/80">Overall ROAS:</p>
                        <p className="text-5xl sm:text-6xl font-semibold text-emerald-400 tracking-tighter">
                            {campaign.roas != null ? campaign.roas.toFixed(1) + "x" : "2.8x"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Mini Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-7 gap-3">
                <div className="col-span-2 lg:col-span-1 border border-border/70 bg-card rounded-[14px] p-3 shadow-sm flex flex-col justify-center">
                    <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-2">Audience Snapshot</p>
                    <div className="flex items-center gap-4">
                        <div>
                            <p className="text-xs text-muted-foreground mb-0.5">Best Age</p>
                            <p className="text-lg font-medium text-emerald-400">40+</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground mb-0.5">Leading Gender</p>
                            <p className="text-lg font-medium text-emerald-400">Male</p>
                        </div>
                    </div>
                </div>

                <div className="border border-border/70 bg-card rounded-[14px] p-3 shadow-sm flex flex-col justify-center">
                    <p className="text-xs text-muted-foreground mb-1">Best Market</p>
                    <p className="text-sm font-medium text-emerald-400 leading-tight">Spain -<br />Catalonia</p>
                </div>

                <div className="border border-border/70 bg-card rounded-[14px] p-3 shadow-sm flex flex-col justify-center">
                    <p className="text-xs text-muted-foreground mb-1">Best Day</p>
                    <p className="text-base font-medium text-emerald-400">Sunday</p>
                </div>

                <div className="border border-border/70 bg-card rounded-[14px] p-3 shadow-sm flex flex-col justify-center">
                    <p className="text-xs text-muted-foreground mb-1">Best Hour</p>
                    <p className="text-base font-medium text-emerald-400">8 PM</p>
                </div>

                <div className="border border-border/70 bg-card rounded-[14px] p-3 shadow-sm flex flex-col justify-center">
                    <p className="text-xs text-muted-foreground mb-1">Top Creative</p>
                    <p className="text-base font-medium text-emerald-400">Video A</p>
                </div>

                <div className="col-span-2 lg:col-span-2 border border-border/70 bg-[#16120f] rounded-[14px] p-4 shadow-sm relative overflow-hidden flex flex-col justify-center">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-amber-500/5 pointer-events-none" />
                    <p className="text-xs text-orange-200/60 mb-1 relative z-10">Budget Pace</p>
                    <p className="text-xl font-semibold text-orange-400 relative z-10 mb-2">
                        {campaign.dailyBudget != null ? fmtUsd(campaign.dailyBudget) : "$12,500"}
                    </p>
                    <div className="w-full bg-black/40 h-1.5 rounded-full relative z-10 overflow-hidden">
                        <div className="h-full bg-orange-500 rounded-full w-[93%]" />
                    </div>
                    <p className="text-[10px] text-orange-200/50 mt-1.5 relative z-10">Daily, 93% on track</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-[1fr_400px] gap-4">
                {/* Performance Timeline */}
                <div className="border border-border/70 bg-card rounded-[20px] p-5 shadow-sm min-h-[300px] flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-medium">Performance Timeline</h3>
                        <button className="flex items-center gap-2 text-xs text-muted-foreground border border-border/70 rounded-md px-2.5 py-1.5 hover:bg-muted/50 transition-colors">
                            Timeline <ChevronDown className="w-3 h-3" />
                        </button>
                    </div>
                    <div className="flex-1 min-h-[220px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={mockTimelineData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                                    tickFormatter={(val) => fmtUsd(val as number)}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }}
                                    itemStyle={{ color: "hsl(var(--foreground))" }}
                                />
                                <Area type="monotone" dataKey="spend" stroke="#2dd4bf" strokeWidth={3} fillOpacity={1} fill="url(#colorSpend)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex items-center gap-4 mt-4 text-xs">
                        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-teal-400" /> <span className="text-muted-foreground">Spend</span></div>
                        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-400" /> <span className="text-muted-foreground">Revenue</span></div>
                        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-orange-400" /> <span className="text-muted-foreground">ROAS</span></div>
                    </div>
                </div>

                {/* Heatmap */}
                <div className="border border-border/70 bg-card rounded-[20px] p-5 shadow-sm flex flex-col">
                    <h3 className="font-medium mb-6">Top Performing Times</h3>
                    <div className="flex-1 flex flex-col">
                        <div className="flex relative">
                            {/* Days column */}
                            <div className="w-10 pr-2 flex flex-col justify-between text-[10px] text-muted-foreground py-2">
                                {days.map((d, i) => <span key={d}>{d}</span>)}
                            </div>
                            {/* Grid */}
                            <div className="flex-1 grid grid-rows-7 gap-0.5 relative pt-2 pb-2">
                                {heatmapData.map((row, dIdx) => (
                                    <div key={dIdx} className="grid gap-0.5" style={{ gridTemplateColumns: "repeat(24, minmax(0, 1fr))" }}>
                                        {row.map((val, hIdx) => {
                                            // Use a color scale from blue/slate to orange/amber depending on value
                                            // Low: slate-800. Medium: teal/blue. High: orange/amber
                                            let bgClass = "bg-[#1e293b]"; // default slate
                                            if (val > 80) bgClass = "bg-orange-400/80";
                                            else if (val > 60) bgClass = "bg-orange-400/50";
                                            else if (val > 40) bgClass = "bg-teal-500/60";
                                            else if (val > 20) bgClass = "bg-teal-500/30";
                                            else bgClass = "bg-teal-900/40";

                                            return (
                                                <div
                                                    key={hIdx}
                                                    className={"w-full h-full rounded-sm " + bgClass + " hover:opacity-80 transition-opacity cursor-pointer"}
                                                    title={days[dIdx] + " " + hIdx + ":00 - Score: " + val}
                                                />
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* X Axis labels */}
                        <div className="flex ml-10 mt-2 text-[10px] text-muted-foreground">
                            <div className="flex-1 flex justify-between">
                                <span>1</span>
                                <span>3</span>
                                <span>5</span>
                                <span>7</span>
                                <span>9</span>
                                <span>11</span>
                                <span>13</span>
                                <span>15</span>
                                <span>17</span>
                                <span>19</span>
                                <span>21</span>
                                <span>23</span>
                            </div>
                        </div>
                        <div className="text-center text-[10px] text-muted-foreground mt-4">Hour of day</div>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-[1fr_400px] gap-4">
                {/* Ad Performance */}
                <div className="border border-border/70 bg-card rounded-[20px] p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-medium">Ad Performance</h3>
                        <div className="flex items-center gap-2">
                            <button className="flex items-center gap-2 text-xs text-muted-foreground border border-border/70 rounded-md px-2.5 py-1.5 hover:bg-muted/50 transition-colors">
                                <Sparkles className="w-3 h-3" /> Creative <ChevronDown className="w-3 h-3" />
                            </button>
                            <button className="flex items-center gap-2 text-xs text-muted-foreground border border-border/70 rounded-md px-2.5 py-1.5 hover:bg-muted/50 transition-colors">
                                Metrics <ChevronDown className="w-3 h-3" />
                            </button>
                        </div>
                    </div>

                    {/* Ad Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex flex-col gap-3 group cursor-pointer">
                                <div className="relative aspect-video rounded-xl bg-muted overflow-hidden border border-border/50 group-hover:border-emerald-500/50 transition-colors">
                                    <div className="absolute top-2 left-2 z-10 bg-emerald-500/20 text-emerald-400 text-[10px] font-medium px-2 py-0.5 rounded flex items-center gap-1 backdrop-blur-md border border-emerald-500/20">
                                        <Sparkles className="w-3 h-3" /> Top Performer
                                    </div>
                                    <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900" />
                                    {/* Placeholder for actual image */}
                                    <div className="absolute inset-0 bg-black/20" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-sm font-medium leading-tight">Don Omar Barcelona...</h4>
                                    <p className="text-[10px] text-muted-foreground">@donotomar</p>
                                    <p className="text-xs text-muted-foreground leading-snug mt-2 line-clamp-3">
                                        The Barcelona campaign is seeing exceptional engagement, driving a significant ROAS increase...
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="border border-border/70 bg-[#0f1216] rounded-[20px] p-5 shadow-sm relative overflow-hidden flex flex-col">
                    <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none" />
                    <div className="flex items-center gap-2 mb-6">
                        <Bot className="w-4 h-4 text-blue-400" />
                        <h3 className="font-medium text-blue-50">Recommendations</h3>
                    </div>

                    <div className="space-y-4 flex-1">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-start gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500/50 mt-2 shrink-0" />
                                <p className="text-sm text-blue-100/70 leading-relaxed">
                                    <strong className="text-blue-100 font-medium">Strategy:</strong> Plan for scaling campaign spend ahead of peak event dates based on strong historical performance trends.
                                </p>
                            </div>
                        ))}
                    </div>

                    <button className="w-full mt-6 bg-blue-600 hover:bg-blue-500 text-white rounded-full py-2.5 text-sm font-medium transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20">
                        <Bot className="w-4 h-4" /> AI Helper / Ask Outlet
                    </button>
                </div>
            </div>
        </div>
    );
}
