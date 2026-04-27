import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import HistoryBoard from "./HistoryBoard";

describe("HistoryBoard Component", () => {
  it("renders the title", () => {
    render(<HistoryBoard title="Top Scores" />);
    expect(screen.getByText("Top Scores")).toBeInTheDocument();
  });

  it("shows empty message when no entries provided", () => {
    render(<HistoryBoard />);
    expect(screen.getByText("Aucune partie enregistree.")).toBeInTheDocument();
  });

  it("renders entries with rank, name and score", () => {
    const entries = [
      { name: "Alice", score: 800 },
      { name: "Bob", score: 400 },
    ];
    render(<HistoryBoard entries={entries} defaultExpanded />);
    expect(screen.getByText(/1\. Alice/)).toBeInTheDocument();
    expect(screen.getByText(/2\. Bob/)).toBeInTheDocument();
    expect(screen.getByText("800")).toBeInTheDocument();
    expect(screen.getByText("400")).toBeInTheDocument();
  });

  it("is collapsed by default", () => {
    const { container } = render(<HistoryBoard />);
    expect(container.querySelector(".history")).toHaveClass("is-closed");
  });

  it("is expanded when defaultExpanded is true", () => {
    const { container } = render(<HistoryBoard defaultExpanded />);
    expect(container.querySelector(".history")).toHaveClass("is-open");
  });

  it("toggles open and closed when the trigger button is clicked", () => {
    const { container } = render(<HistoryBoard />);
    const trigger = screen.getByRole("button");
    expect(container.querySelector(".history")).toHaveClass("is-closed");
    fireEvent.click(trigger);
    expect(container.querySelector(".history")).toHaveClass("is-open");
    fireEvent.click(trigger);
    expect(container.querySelector(".history")).toHaveClass("is-closed");
  });

  it("uses 'Unknown' for entries missing a name", () => {
    render(<HistoryBoard entries={[{ score: 100 }]} defaultExpanded />);
    expect(screen.getByText(/Unknown/)).toBeInTheDocument();
  });
});
