interface MiniMapPoint {
  x: number;
  y: number;
}

interface MiniMapStage {
  height: number;
  label?: string;
  width: number;
  x: number;
  y: number;
}

interface MiniMapSection {
  id: string;
  label?: string;
  polygon?: MiniMapPoint[];
  points?: Array<[number, number]>;
}

export interface MiniMapLayout {
  canvas?: {
    height?: number;
    width?: number;
  };
  sections?: MiniMapSection[];
  stage?: MiniMapStage;
}

export interface RenderSectionMiniMapInput {
  highlightedSection: string;
  layout: MiniMapLayout;
}

export interface RenderSectionMiniMapResult {
  svg: string;
}

const DEFAULT_CANVAS = { height: 260, width: 360 };

function escapeXml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    switch (character) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      case "'":
        return "&apos;";
      default:
        return character;
    }
  });
}

function polygonToPoints(points: MiniMapPoint[]): string {
  return points.map((point) => `${point.x},${point.y}`).join(" ");
}

function getSectionPoints(section: MiniMapSection): MiniMapPoint[] {
  if (section.polygon && section.polygon.length >= 3) {
    return section.polygon;
  }

  if (section.points && section.points.length >= 3) {
    return section.points.map(([x, y]) => ({ x, y }));
  }

  return [];
}

function pointAverage(points: MiniMapPoint[]): MiniMapPoint {
  const total = points.reduce(
    (accumulator, point) => {
      accumulator.x += point.x;
      accumulator.y += point.y;
      return accumulator;
    },
    { x: 0, y: 0 },
  );

  return {
    x: total.x / points.length,
    y: total.y / points.length,
  };
}

function renderStage(stage: MiniMapStage): string {
  const label = escapeXml(stage.label ?? "STAGE");
  const textX = stage.x + stage.width / 2;
  const textY = stage.y + stage.height / 2 + 4;

  return `
    <g data-layer="stage">
      <rect x="${stage.x}" y="${stage.y}" width="${stage.width}" height="${stage.height}" rx="10" fill="#111827" />
      <text x="${textX}" y="${textY}" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" font-weight="700" letter-spacing="0.16em" fill="#f8fafc">${label}</text>
    </g>
  `;
}

function renderDetailedLayout(
  layout: MiniMapLayout,
  highlightedSection: string,
  stage: MiniMapStage,
  sections: MiniMapSection[],
): string {
  const sectionMarkup = sections
    .map((section) => {
      const polygon = getSectionPoints(section);
      if (polygon.length < 3) {
        return "";
      }

      const highlighted = section.id === highlightedSection;
      const center = pointAverage(polygon);
      return `
        <g data-section-id="${escapeXml(section.id)}" data-highlighted="${highlighted ? "true" : "false"}">
          <polygon
            points="${polygonToPoints(polygon)}"
            fill="${highlighted ? "#f59e0b" : "#dbeafe"}"
            stroke="${highlighted ? "#92400e" : "#93c5fd"}"
            stroke-width="${highlighted ? "3" : "1.5"}"
          />
          <text
            x="${center.x}"
            y="${center.y + 4}"
            text-anchor="middle"
            font-family="Arial, sans-serif"
            font-size="11"
            font-weight="${highlighted ? "700" : "600"}"
            fill="${highlighted ? "#78350f" : "#1e3a8a"}"
          >${escapeXml(section.label ?? section.id)}</text>
        </g>
      `;
    })
    .join("");

  const canvas = layout.canvas ?? DEFAULT_CANVAS;

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${canvas.width ?? DEFAULT_CANVAS.width} ${canvas.height ?? DEFAULT_CANVAS.height}" role="img" aria-label="Ticket concierge section map" data-render-mode="detailed" data-highlighted-section="${escapeXml(highlightedSection)}">
      <rect width="100%" height="100%" rx="24" fill="#f8fafc" />
      ${renderStage(stage)}
      <g data-layer="sections">
        ${sectionMarkup}
      </g>
      <text x="50%" y="${(canvas.height ?? DEFAULT_CANVAS.height) - 16}" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" fill="#6b7280">Highlighted section ${escapeXml(highlightedSection)}</text>
    </svg>
  `;
}

function renderAbstractLayout(
  layout: MiniMapLayout,
  highlightedSection: string,
  stage: MiniMapStage,
): string {
  const canvas = layout.canvas ?? DEFAULT_CANVAS;
  const highlightX = 40 + ((Number.parseInt(highlightedSection.replace(/\D/g, ""), 10) || 0) % 4) * 68;

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${canvas.width ?? DEFAULT_CANVAS.width} ${canvas.height ?? DEFAULT_CANVAS.height}" role="img" aria-label="Ticket concierge abstract bowl map" data-render-mode="abstract" data-highlighted-section="${escapeXml(highlightedSection)}">
      <rect width="100%" height="100%" rx="24" fill="#f8fafc" />
      <ellipse cx="${(canvas.width ?? DEFAULT_CANVAS.width) / 2}" cy="${(canvas.height ?? DEFAULT_CANVAS.height) - 66}" rx="${(canvas.width ?? DEFAULT_CANVAS.width) / 2 - 24}" ry="82" fill="#eff6ff" stroke="#bfdbfe" stroke-width="2" />
      <ellipse cx="${(canvas.width ?? DEFAULT_CANVAS.width) / 2}" cy="${(canvas.height ?? DEFAULT_CANVAS.height) - 52}" rx="${(canvas.width ?? DEFAULT_CANVAS.width) / 2 - 58}" ry="58" fill="#ffffff" stroke="#dbeafe" stroke-width="2" />
      <rect x="${highlightX}" y="108" width="56" height="42" rx="10" fill="#f59e0b" stroke="#92400e" stroke-width="2" opacity="0.9" />
      ${renderStage(stage)}
      <text x="${highlightX + 28}" y="133" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" font-weight="700" fill="#78350f">${escapeXml(highlightedSection)}</text>
      <text x="50%" y="${(canvas.height ?? DEFAULT_CANVAS.height) - 16}" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" fill="#6b7280">Approximate section area</text>
    </svg>
  `;
}

function hasUsableGeometry(
  section: MiniMapSection | undefined,
): section is MiniMapSection & {
  polygon?: MiniMapPoint[];
  points?: Array<[number, number]>;
} {
  return getSectionPoints(section ?? { id: "" }).length >= 3;
}

function getStage(layout: MiniMapLayout): MiniMapStage {
  return layout.stage ?? {
    height: 20,
    label: "STAGE",
    width: 86,
    x: 137,
    y: 20,
  };
}

export function renderSectionMiniMap(input: RenderSectionMiniMapInput): RenderSectionMiniMapResult {
  const sections = input.layout.sections ?? [];
  const highlightedSection = sections.find((section) => section.id === input.highlightedSection);
  const stage = getStage(input.layout);

  if (hasUsableGeometry(highlightedSection)) {
    return {
      svg: renderDetailedLayout(input.layout, input.highlightedSection, stage, sections),
    };
  }

  return {
    svg: renderAbstractLayout(input.layout, input.highlightedSection, stage),
  };
}
