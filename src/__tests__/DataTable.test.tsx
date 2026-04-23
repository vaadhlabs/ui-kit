import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DataTable, type DataTableColumn } from "../DataTable.js";

interface Row {
  id: string;
  name: string;
  count: number;
}

const cols: ReadonlyArray<DataTableColumn<Row>> = [
  { key: "name", header: "Name" },
  { key: "count", header: "#", align: "right", render: (r) => `n=${r.count}` },
];

describe("DataTable", () => {
  it("renders rows with custom render and default value lookup", () => {
    render(
      <DataTable
        rows={[{ id: "1", name: "alpha", count: 3 }]}
        columns={cols}
        getRowKey={(r) => r.id}
      />,
    );
    expect(screen.getByText("alpha")).toBeInTheDocument();
    expect(screen.getByText("n=3")).toBeInTheDocument();
  });

  it("renders skeleton when loading", () => {
    const { container } = render(
      <DataTable rows={[]} columns={cols} getRowKey={(r) => r.id} loading skeletonRows={3} />,
    );
    expect(container.querySelectorAll(".MuiSkeleton-root").length).toBeGreaterThan(0);
  });

  it("renders error message", () => {
    render(<DataTable rows={[]} columns={cols} getRowKey={(r) => r.id} error="boom" />);
    expect(screen.getByText("boom")).toBeInTheDocument();
  });

  it("renders empty message when no rows and not loading", () => {
    render(
      <DataTable rows={[]} columns={cols} getRowKey={(r) => r.id} emptyMessage="nada" />,
    );
    expect(screen.getByText("nada")).toBeInTheDocument();
  });

  it("invokes onRowClick", async () => {
    const onRowClick = vi.fn();
    const user = userEvent.setup();
    render(
      <DataTable
        rows={[{ id: "1", name: "alpha", count: 1 }]}
        columns={cols}
        getRowKey={(r) => r.id}
        onRowClick={onRowClick}
      />,
    );
    await user.click(screen.getByText("alpha"));
    expect(onRowClick).toHaveBeenCalledTimes(1);
  });

  it("falls back to em-dash when neither render nor key matches", () => {
    const colsWithMissing: ReadonlyArray<DataTableColumn<Row>> = [
      { key: "missing", header: "M" },
    ];
    render(
      <DataTable
        rows={[{ id: "1", name: "x", count: 1 }]}
        columns={colsWithMissing}
        getRowKey={(r) => r.id}
      />,
    );
    expect(screen.getByText("—")).toBeInTheDocument();
  });
});
