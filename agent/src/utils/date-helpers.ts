/** CST date helpers shared across agent sweeps and routines. */

export function todayCST(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "America/Chicago" });
}

export function yesterdayCST(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toLocaleDateString("en-CA", { timeZone: "America/Chicago" });
}

export function tomorrowCST(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toLocaleDateString("en-CA", { timeZone: "America/Chicago" });
}
