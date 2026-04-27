import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import * as AuthContext from "../../contexts/AuthContext";
import * as quoteApi from "../../utils/quoteApi";
import * as leaderboard from "../../resources/leaderboard/leaderboard";
import TypeGame from "./TypeGame";

vi.mock("../../contexts/AuthContext", () => ({ useAuth: vi.fn() }));
vi.mock("../../utils/quoteApi", () => ({
  fetchRandomQuote: vi.fn(),
  detectLanguage: vi.fn(() => "en"),
}));
vi.mock("../../resources/leaderboard/leaderboard", () => ({
  loadLeaderboard: vi.fn(() => Promise.resolve([])),
  pushLeaderboardScore: vi.fn(() => Promise.resolve([])),
}));

function renderGame() {
  return render(
    <MemoryRouter>
      <TypeGame />
    </MemoryRouter>
  );
}

describe("TypeGame Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(AuthContext.useAuth).mockReturnValue({ user: null });
    vi.mocked(quoteApi.fetchRandomQuote).mockResolvedValue({
      quote: "Be the change you wish to see.",
      author: "Gandhi",
    });
  });

  it("renders the score HUD", async () => {
    renderGame();
    expect(screen.getByText(/Score:/)).toBeInTheDocument();
    expect(screen.getByText(/Streak:/)).toBeInTheDocument();
    expect(screen.getByText(/Best:/)).toBeInTheDocument();
    await waitFor(() =>
      expect(
        screen.getByText("Be the change you wish to see.")
      ).toBeInTheDocument()
    );
  });

  it("displays the quote after loading", async () => {
    renderGame();
    await waitFor(() =>
      expect(
        screen.getByText("Be the change you wish to see.")
      ).toBeInTheDocument()
    );
  });

  it("shows the submit button enabled once text is typed", async () => {
    renderGame();
    await waitFor(() =>
      expect(screen.getByText("Be the change you wish to see.")).toBeInTheDocument()
    );
    const input = screen.getByRole("textbox", { name: /Author name/i });
    fireEvent.change(input, { target: { value: "Gan" } });
    expect(screen.getByRole("button", { name: /Submit/i })).not.toBeDisabled();
  });

  it("shows correct feedback on the right answer", async () => {
    renderGame();
    await waitFor(() =>
      expect(screen.getByText("Be the change you wish to see.")).toBeInTheDocument()
    );
    const input = screen.getByRole("textbox", { name: /Author name/i });
    fireEvent.change(input, { target: { value: "Gandhi" } });
    fireEvent.click(screen.getByRole("button", { name: /Submit/i }));
    await waitFor(() =>
      expect(screen.getByText(/Correct!/)).toBeInTheDocument()
    );
  });

  it("shows wrong feedback on an incorrect answer", async () => {
    renderGame();
    await waitFor(() =>
      expect(screen.getByText("Be the change you wish to see.")).toBeInTheDocument()
    );
    const input = screen.getByRole("textbox", { name: /Author name/i });
    fireEvent.change(input, { target: { value: "Shakespeare" } });
    fireEvent.click(screen.getByRole("button", { name: /Submit/i }));
    await waitFor(() =>
      expect(screen.getByText(/Mauvaise réponse/)).toBeInTheDocument()
    );
  });

  it("increments score on a correct answer", async () => {
    renderGame();
    await waitFor(() =>
      expect(screen.getByText("Be the change you wish to see.")).toBeInTheDocument()
    );
    const input = screen.getByRole("textbox", { name: /Author name/i });
    fireEvent.change(input, { target: { value: "Gandhi" } });
    fireEvent.click(screen.getByRole("button", { name: /Submit/i }));
    await waitFor(() =>
      expect(screen.getByText(/Score: [1-9]/)).toBeInTheDocument()
    );
  });

  it("accepts keyboard-selected suggestion", async () => {
    renderGame();
    await waitFor(() =>
      expect(screen.getByText("Be the change you wish to see.")).toBeInTheDocument()
    );

    const input = screen.getByRole("textbox", { name: /Author name/i });
    fireEvent.change(input, { target: { value: "Ada" } });

    await waitFor(() =>
      expect(screen.getByRole("listbox", { name: /Author suggestions/i })).toBeInTheDocument()
    );

    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(screen.getByDisplayValue("Ada Lovelace")).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.getByText(/Mauvaise réponse/)).toBeInTheDocument()
    );
  });

  it("saves the score after a wrong answer for authenticated users", async () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      user: {
        id: "user-1",
        user_metadata: { username: "Tester" },
      },
    });

    renderGame();
    await waitFor(() =>
      expect(screen.getByText("Be the change you wish to see.")).toBeInTheDocument()
    );

    const input = screen.getByRole("textbox", { name: /Author name/i });
    fireEvent.change(input, { target: { value: "Gandhi" } });
    fireEvent.click(screen.getByRole("button", { name: /Submit/i }));
    await waitFor(() => expect(screen.getByText(/Correct!/)).toBeInTheDocument());

    fireEvent.click(screen.getByRole("button", { name: /Next quote/i }));
    await waitFor(() =>
      expect(screen.getByText("Be the change you wish to see.")).toBeInTheDocument()
    );

    fireEvent.change(screen.getByRole("textbox", { name: /Author name/i }), {
      target: { value: "Wrong" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Submit/i }));

    await waitFor(() =>
      expect(leaderboard.pushLeaderboardScore).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Tester",
          userId: "user-1",
          gameType: "typing",
          score: expect.any(Number),
        })
      )
    );
  });
});
