import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import * as AuthContext from "../../contexts/AuthContext";
import Navbar from "./Navbar";

vi.mock("../../contexts/AuthContext", () => ({
  useAuth: vi.fn(),
}));

vi.mock("../../utils/supabase", () => ({
  supabase: { auth: { signOut: vi.fn() } },
  isSupabaseConfigured: false,
}));

function renderNavbar() {
  return render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>
  );
}

describe("Navbar Component", () => {
  beforeEach(() => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({ user: null });
  });

  it("renders the logo", () => {
    renderNavbar();
    expect(screen.getByAltText("logo")).toBeInTheDocument();
  });

  it("renders all main navigation links", () => {
    renderNavbar();
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Flash citation")).toBeInTheDocument();
    expect(screen.getByText("Saisie agile")).toBeInTheDocument();
    expect(screen.getByText("Verdict expess")).toBeInTheDocument();
  });

  it("shows login and register buttons when no user is logged in", () => {
    renderNavbar();
    expect(screen.getByText("Connexion")).toBeInTheDocument();
    expect(screen.getByText("Inscription")).toBeInTheDocument();
  });

  it("shows account and logout buttons when a user is logged in", () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({ user: { id: "1" } });
    renderNavbar();
    expect(screen.getByText("Mon compte")).toBeInTheDocument();
    expect(screen.getByText("Déconnexion")).toBeInTheDocument();
  });

  it("toggles the burger menu on click", () => {
    const { container } = renderNavbar();
    const topnav = container.querySelector("#topnav");
    expect(topnav).toHaveAttribute("data-reverse", "true");
    fireEvent.click(screen.getByAltText("burger_menu_icon"));
    expect(topnav).toHaveAttribute("data-reverse", "false");
  });
});
