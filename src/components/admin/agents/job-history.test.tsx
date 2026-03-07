import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { JobHistory } from "@/components/admin/agents/job-history";
import type { AgentJob } from "@/app/admin/agents/data";

afterEach(() => {
  cleanup();
});

const jobs: AgentJob[] = [
  {
    id: "job_error",
    agent_id: "meta-ads",
    status: "error",
    prompt: "Sync campaigns",
    result: null,
    error: "Token expired",
    created_at: "2026-03-06T10:00:00.000Z",
    started_at: "2026-03-06T10:00:00.000Z",
    finished_at: "2026-03-06T10:02:00.000Z",
  },
  {
    id: "job_running",
    agent_id: "tm-monitor",
    status: "running",
    prompt: "Check arena night",
    result: null,
    error: null,
    created_at: "2026-03-06T11:00:00.000Z",
    started_at: "2026-03-06T11:01:00.000Z",
    finished_at: null,
  },
  {
    id: "job_pending",
    agent_id: "campaign-monitor",
    status: "pending",
    prompt: "Review launch pacing",
    result: null,
    error: null,
    created_at: "2026-03-06T11:05:00.000Z",
    started_at: null,
    finished_at: null,
  },
  {
    id: "job_done",
    agent_id: "email-agent",
    status: "done",
    prompt: "Triage new inbox thread",
    result: "Draft ready",
    error: null,
    created_at: "2026-03-06T09:00:00.000Z",
    started_at: "2026-03-06T09:01:00.000Z",
    finished_at: "2026-03-06T09:04:00.000Z",
  },
];

describe("JobHistory", () => {
  it("filters automated runs by search text", () => {
    render(<JobHistory jobs={jobs} />);

    fireEvent.change(screen.getByLabelText("Search automated runs"), {
      target: { value: "token expired" },
    });

    expect(screen.getByText("Token expired")).toBeInTheDocument();
    expect(screen.queryByText("Draft ready")).not.toBeInTheDocument();
    expect(screen.getByText("Showing 1 of 4 automated runs.")).toBeInTheDocument();
  });

  it("filters automated runs by workflow state", () => {
    render(<JobHistory jobs={jobs} />);

    fireEvent.click(screen.getByRole("button", { name: /In flight/i }));

    expect(screen.getByText("TM One Monitor")).toBeInTheDocument();
    expect(screen.getByText("Campaign Monitor")).toBeInTheDocument();
    expect(screen.queryByText("Token expired")).not.toBeInTheDocument();
    expect(screen.queryByText("Draft ready")).not.toBeInTheDocument();
    expect(screen.getByText("Showing 2 of 4 automated runs.")).toBeInTheDocument();
  });
});
