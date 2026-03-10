/** CST date helpers shared across agent sweeps and routines. */

function cstNow(): Date {
  return new Date(new Date().toLocaleString("en-US", { timeZone: "America/Chicago" }));
}

export function todayCST(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "America/Chicago" });
}

export function yesterdayCST(): string {
  const d = cstNow();
  d.setDate(d.getDate() - 1);
  return d.toLocaleDateString("en-CA");
}

export function tomorrowCST(): string {
  const d = cstNow();
  d.setDate(d.getDate() + 1);
  return d.toLocaleDateString("en-CA");
}
