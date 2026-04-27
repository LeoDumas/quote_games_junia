import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import NamePromptModal from "./NamePromptModal";

describe("NamePromptModal Component", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("displays the score with pts suffix", () => {
    render(<NamePromptModal score={1200} onSave={vi.fn()} />);
    expect(screen.getByText(/pts/)).toBeInTheDocument();
  });

  it("renders the name input field", () => {
    render(<NamePromptModal score={0} onSave={vi.fn()} />);
    expect(screen.getByLabelText(/Votre nom/)).toBeInTheDocument();
  });

  it("calls onSave with the typed name on submit", () => {
    const onSave = vi.fn();
    render(<NamePromptModal score={500} onSave={onSave} />);
    fireEvent.change(screen.getByLabelText(/Votre nom/), {
      target: { value: "Alice" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Sauvegarder/ }));
    expect(onSave).toHaveBeenCalledWith("Alice");
  });

  it("falls back to 'Player' when the name input is blank", () => {
    const onSave = vi.fn();
    render(<NamePromptModal score={0} onSave={onSave} />);
    fireEvent.click(screen.getByRole("button", { name: /Sauvegarder/ }));
    expect(onSave).toHaveBeenCalledWith("Player");
  });

  it("pre-fills the input from localStorage", () => {
    localStorage.setItem("quote-game-player-name", "Bob");
    render(<NamePromptModal score={0} onSave={vi.fn()} />);
    expect(screen.getByLabelText(/Votre nom/).value).toBe("Bob");
  });

  it("saves the name to localStorage on submit", () => {
    const onSave = vi.fn();
    render(<NamePromptModal score={0} onSave={onSave} />);
    fireEvent.change(screen.getByLabelText(/Votre nom/), {
      target: { value: "Charlie" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Sauvegarder/ }));
    expect(localStorage.getItem("quote-game-player-name")).toBe("Charlie");
  });
});
