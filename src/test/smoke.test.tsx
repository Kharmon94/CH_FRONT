import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { FormatSelector } from "../components/exports/FormatSelector";
import { HomePage } from "../pages/HomePage";
import { OAuthGoogleCallbackPage } from "../pages/OAuthGoogleCallbackPage";
import { TeamSwitcher } from "../components/teams/TeamSwitcher";
import { TeamProvider } from "../contexts/TeamContext";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import * as apiModule from "../services/api";

const navigateMock = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

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
      <MemoryRouter>
        <AuthProvider>
          <TeamProvider>
            <TeamSwitcher />
          </TeamProvider>
        </AuthProvider>
      </MemoryRouter>
    );
    expect(screen.getByText("Team")).toBeInTheDocument();
  });
});

describe("OAuthGoogleCallbackPage", () => {
  beforeEach(() => {
    navigateMock.mockReset();
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("hydrates auth via refreshMe before navigating on success", async () => {
    let authMeDone = false;
    const user = {
      id: 1,
      email: "user@example.com",
      role: "user" as const,
      name: "User",
      avatar_url: null,
      teams: [],
    };
    vi.spyOn(apiModule.api, "authMe").mockImplementation(async () => {
      authMeDone = true;
      return { user };
    });
    navigateMock.mockImplementation(() => {
      expect(authMeDone).toBe(true);
    });

    render(
      <MemoryRouter initialEntries={["/app/oauth/google/callback?token=abc&next=/app"]}>
        <AuthProvider>
          <Routes>
            <Route path="/app/oauth/google/callback" element={<OAuthGoogleCallbackPage />} />
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    );

    await waitFor(() => expect(navigateMock).toHaveBeenCalledWith("/app", { replace: true }));
    expect(apiModule.getToken()).toBe("abc");
    expect(apiModule.api.authMe).toHaveBeenCalled();
  });

  it("redirects to login when token is missing", async () => {
    vi.spyOn(apiModule.api, "authMe");

    render(
      <MemoryRouter initialEntries={["/app/oauth/google/callback"]}>
        <AuthProvider>
          <Routes>
            <Route path="/app/oauth/google/callback" element={<OAuthGoogleCallbackPage />} />
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(navigateMock).toHaveBeenCalledWith("/app/login?oauth_error=Google+sign-in+failed", {
        replace: true,
      })
    );
    expect(apiModule.api.authMe).not.toHaveBeenCalled();
  });
});

describe("AuthContext adminSignIn", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it("sets token and user from admin sign-in response", async () => {
    const adminUser = {
      id: 1,
      email: "admin@example.com",
      role: "admin" as const,
      name: "Admin",
      avatar_url: null,
      teams: [],
    };
    vi.spyOn(apiModule.api, "authMe").mockRejectedValueOnce(new Error("skip bootstrap"));
    vi.spyOn(apiModule.api, "adminSignIn").mockResolvedValue({
      token: "admin-jwt",
      user: adminUser,
    });

    function Probe() {
      const { adminSignIn, user } = useAuth();
      return (
        <div>
          <button type="button" onClick={() => void adminSignIn("admin@example.com", "secret")}>
            sign in
          </button>
          <span data-testid="role">{user?.role ?? "none"}</span>
        </div>
      );
    }

    render(
      <MemoryRouter>
        <AuthProvider>
          <Probe />
        </AuthProvider>
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByTestId("role")).toHaveTextContent("none"));
    await userEvent.click(screen.getByRole("button", { name: "sign in" }));

    await waitFor(() => expect(screen.getByTestId("role")).toHaveTextContent("admin"));
    expect(apiModule.getToken()).toBe("admin-jwt");
  });
});
