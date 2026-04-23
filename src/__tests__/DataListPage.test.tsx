import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { DataListPage } from "../DataListPage.js";

describe("DataListPage", () => {
  it("renders title and child", () => {
    render(
      <DataListPage title="Hello">
        <div>body</div>
      </DataListPage>,
    );
    expect(screen.getByText("Hello")).toBeInTheDocument();
    expect(screen.getByText("body")).toBeInTheDocument();
  });

  it("renders subtitle and actions", () => {
    render(
      <DataListPage title="T" subtitle="S" actions={<button>act</button>}>
        x
      </DataListPage>,
    );
    expect(screen.getByText("S")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "act" })).toBeInTheDocument();
  });
});
