import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PageViewClient } from "./page-view-client";

const plateEditorSpy = vi.fn(
  ({ clientSlug }: { clientSlug?: string }) => <div data-testid="plate-editor">{clientSlug}</div>,
);

vi.mock("./page-title", () => ({
  PageTitle: () => <div>Page title</div>,
}));

vi.mock("./page-icon", () => ({
  PageIcon: () => <div>Page icon</div>,
}));

vi.mock("./page-cover", () => ({
  PageCover: () => <div>Page cover</div>,
}));

vi.mock("./plate-editor", () => ({
  PlateEditor: (props: { clientSlug?: string }) => plateEditorSpy(props),
}));

vi.mock("./comment-sidebar", () => ({
  CommentSidebar: () => <div>Comments sidebar</div>,
}));

describe("PageViewClient", () => {
  it("passes the workspace client slug to the editor", () => {
    render(
      <PageViewClient
        clientSlug="zamora"
        currentUserId="user-1"
        page={{
          client_slug: "zamora",
          content: [],
          cover_image: null,
          created_by: "user-1",
          created_at: "2026-03-01T00:00:00.000Z",
          icon: null,
          id: "page-1",
          is_archived: false,
          parent_page_id: null,
          position: 0,
          title: "Launch plan",
          updated_at: "2026-03-05T00:00:00.000Z",
        }}
      />,
    );

    expect(screen.getByTestId("plate-editor")).toHaveTextContent("zamora");
  });
});
