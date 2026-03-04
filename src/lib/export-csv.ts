type CsvColumn = {
  header: string;
  accessor: (row: Record<string, unknown>) => string;
};

function sanitize(val: string): string {
  if (/^[=+\-@\t\r]/.test(val)) {
    return `"'${val.replace(/"/g, '""')}"`;
  }
  if (/[",\n]/.test(val)) {
    return `"${val.replace(/"/g, '""')}"`;
  }
  return val;
}

export function exportToCsv(
  rows: Record<string, unknown>[],
  columns: CsvColumn[],
  filename: string
) {
  if (rows.length === 0) return;

  const headers = columns.map((c) => sanitize(c.header));
  const csvRows = rows.map((row) =>
    columns.map((col) => sanitize(col.accessor(row)))
  );

  const csv = [headers.join(","), ...csvRows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function centsToUsdString(cents: number | null | undefined): string {
  if (cents == null) return "";
  return (cents / 100).toFixed(2);
}

export function formatDate(date: string | null | undefined): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function todayFilename(section: string): string {
  const d = new Date().toISOString().split("T")[0];
  return `outlet-${section}-${d}.csv`;
}
