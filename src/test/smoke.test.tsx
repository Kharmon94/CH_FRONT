import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { FormatSelector } from "../components/exports/FormatSelector";
import { HomePage } from "../pages/HomePage";
import { TeamSwitcher } from "../components/teams/TeamSwitcher";
import { TeamProvider } from "../contexts/TeamContext";
import { AuthProvider } from "../contexts/AuthContext";

describe("FormatSelector", () => {
  it("renders markdown and agent clone options", () => {
    render(<FormatSelector value="markdown" onChange={() => undefined} />);
    expect(screen.getByText("Markdown")).toBeInTheDocument();
    expect(screen.getByText("Agent Clone")).toBeInTheDocument();
  });

  it("hides agent clone when showAgentClone is false", () => {
    render(<FormatSelector value="markdown" onChange={() => undefined} showAgentClone={false} />);
    expect(screen.getByText("Markdown")).toBeInTheDocument();
    expect(screen.queryByText("Agent Clone")).not.toBeInTheDocument();
  });
});

describe("HomePage", () => {
  it("renders hero headline", () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    expect(screen.getByText(/Recover broken Cursor agents/i)).toBeInTheDocument();
  });
});

describe("TeamSwitcher", () => {
  it("renders team name when single team", () => {
    render(
      <AuthProvider>
        <TeamProvider>
          <TeamSwitcher />
        </TeamProvider>
      </AuthProvider>
    );
    expect(screen.getByText("Team")).toBeInTheDocument();
  });
});
