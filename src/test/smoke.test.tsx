import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { FormatSelector } from "../components/exports/FormatSelector";
import { HomePage } from "../pages/HomePage";
import { AboutPage } from "../pages/AboutPage";
import { HelpPage } from "../pages/HelpPage";
import { ContactPage } from "../pages/ContactPage";
import { AdminOverviewPage } from "../pages/admin/AdminOverviewPage";
import { AdminUsersPage } from "../pages/admin/AdminUsersPage";
import { AdminLicensesPage } from "../pages/admin/AdminLicensesPage";
import { BlogIndexPage } from "../pages/BlogIndexPage";
import { BlogPostPage } from "../pages/BlogPostPage";
import { AdminBlogPostsPage } from "../pages/admin/AdminBlogPostsPage";
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
    expect(screen.getByText(/Cursor chat export/i)).toBeInTheDocument();
  });
});

describe("marketing pages", () => {
  it("renders About page", () => {
    render(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>
    );
    expect(screen.getByRole("heading", { name: /About Cursor Help/i })).toBeInTheDocument();
  });

  it("renders Help FAQ page", () => {
    render(
      <MemoryRouter>
        <HelpPage />
      </MemoryRouter>
    );
    expect(screen.getByRole("heading", { name: /Help & FAQ/i })).toBeInTheDocument();
    expect(screen.getByText(/What is Cursor Help/i)).toBeInTheDocument();
  });

  it("renders Contact page", () => {
    render(
      <MemoryRouter>
        <ContactPage />
      </MemoryRouter>
    );
    expect(screen.getByRole("heading", { name: /Contact us/i })).toBeInTheDocument();
  });
});

describe("Blog pages", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders blog index with mocked posts", async () => {
    vi.spyOn(apiModule.api.blogPosts, "list").mockResolvedValue([
      {
        id: 1,
        title: "Agent Clone guide",
        slug: "agent-clone-guide",
        excerpt: "How to hand off context.",
        status: "published",
        published_at: "2026-06-01T00:00:00Z",
        created_at: "2026-06-01T00:00:00Z",
        updated_at: "2026-06-01T00:00:00Z",
        meta_title: null,
        meta_description: null,
        cover_image_url: null,
        author: { name: "Team", email: "team@cursorhelp.com" },
      },
    ]);

    render(
      <MemoryRouter>
        <BlogIndexPage />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText("Agent Clone guide")).toBeInTheDocument());
    expect(apiModule.api.blogPosts.list).toHaveBeenCalled();
  });

  it("renders blog post detail", async () => {
    vi.spyOn(apiModule.api.blogPosts, "show").mockResolvedValue({
      id: 1,
      title: "Export tips",
      slug: "export-tips",
      excerpt: "Quick tips",
      body: "<p>Content here</p>",
      status: "published",
      published_at: "2026-06-01T00:00:00Z",
      created_at: "2026-06-01T00:00:00Z",
      updated_at: "2026-06-01T00:00:00Z",
      meta_title: null,
      meta_description: null,
      cover_image_url: null,
      author: { name: "Author", email: "author@example.com" },
    });

    render(
      <MemoryRouter initialEntries={["/blog/export-tips"]}>
        <Routes>
          <Route path="/blog/:slug" element={<BlogPostPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByRole("heading", { name: "Export tips" })).toBeInTheDocument());
    expect(screen.getByText("Content here")).toBeInTheDocument();
  });

  it("renders admin blog list", async () => {
    vi.spyOn(apiModule.api.admin.blogPosts, "list").mockResolvedValue([
      {
        id: 2,
        title: "Draft post",
        slug: "draft-post",
        excerpt: null,
        status: "draft",
        published_at: null,
        created_at: "2026-06-01T00:00:00Z",
        updated_at: "2026-06-01T00:00:00Z",
        meta_title: null,
        meta_description: null,
        cover_image_url: null,
        author: { name: null, email: "admin@example.com" },
      },
    ]);

    render(
      <MemoryRouter>
        <AdminBlogPostsPage />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText("Draft post")).toBeInTheDocument());
    expect(screen.getByText("draft")).toBeInTheDocument();
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

describe("Admin pages", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders overview with mocked stats", async () => {
    vi.spyOn(apiModule.api.admin, "stats").mockResolvedValue({
      users_count: 12,
      admins_count: 1,
      teams_count: 4,
      pro_teams_count: 2,
      free_teams_count: 2,
      total_exports: 99,
      recent_users: [
        {
          id: 1,
          email: "alice@example.com",
          role: "user",
          name: "Alice",
          created_at: "2026-01-01T00:00:00Z",
        },
      ],
      recent_teams: [
        {
          id: 10,
          name: "Acme",
          slug: "acme",
          export_count: 5,
          member_count: 3,
          license: { tier: "pro", pro: true, status: "active" },
        },
      ],
    });

    render(
      <MemoryRouter>
        <AdminOverviewPage />
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(screen.getByRole("heading", { name: "Overview" })).toBeInTheDocument()
    );
    expect(screen.getByText("12")).toBeInTheDocument();
    expect(screen.getByText("alice@example.com")).toBeInTheDocument();
    expect(screen.getByText("Acme")).toBeInTheDocument();
    expect(apiModule.api.admin.stats).toHaveBeenCalled();
  });

  it("renders users list", async () => {
    vi.spyOn(apiModule.api.admin.users, "list").mockResolvedValue([
      {
        id: 1,
        email: "user@example.com",
        name: "User",
        role: "user",
        created_at: "2026-01-01T00:00:00Z",
      },
    ]);

    render(
      <MemoryRouter>
        <AdminUsersPage />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText("user@example.com")).toBeInTheDocument());
    expect(screen.getByPlaceholderText("Search by email or name…")).toBeInTheDocument();
  });

  it("renders licenses page with mocked list", async () => {
    vi.spyOn(apiModule.api.admin.licenses, "list").mockResolvedValue([
      {
        team_id: 10,
        team_name: "Acme",
        team_slug: "acme",
        tier: "pro",
        pro: true,
        status: "active",
        export_count: 5,
        member_count: 3,
      },
    ]);

    render(
      <MemoryRouter initialEntries={["/admin/licenses"]}>
        <AdminLicensesPage />
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(screen.getByRole("heading", { name: "Licenses" })).toBeInTheDocument()
    );
    expect(screen.getByText("Acme")).toBeInTheDocument();
    expect(screen.getAllByText("Pro").length).toBeGreaterThan(0);
    expect(apiModule.api.admin.licenses.list).toHaveBeenCalled();
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
