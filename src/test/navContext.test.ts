import { describe, expect, it } from "vitest";
import { isMinimalChromePath, resolveNavContext, shouldShowShellNav } from "../lib/navContext";

describe("navContext", () => {
  it("resolves public routes", () => {
    expect(resolveNavContext("/")).toBe("public");
    expect(resolveNavContext("/pricing")).toBe("public");
    expect(resolveNavContext("/about")).toBe("public");
    expect(resolveNavContext("/help")).toBe("public");
    expect(resolveNavContext("/contact")).toBe("public");
    expect(resolveNavContext("/privacy")).toBe("public");
  });

  it("resolves app routes except minimal chrome auth paths", () => {
    expect(resolveNavContext("/app")).toBe("app");
    expect(resolveNavContext("/app/composers/abc")).toBe("app");
    expect(resolveNavContext("/app/settings")).toBe("app");
    expect(resolveNavContext("/app/login")).toBe("public");
    expect(resolveNavContext("/app/sign-up")).toBe("public");
    expect(resolveNavContext("/app/oauth/google/callback")).toBe("public");
  });

  it("resolves admin routes except login", () => {
    expect(resolveNavContext("/admin")).toBe("admin");
    expect(resolveNavContext("/admin/users")).toBe("admin");
    expect(resolveNavContext("/admin/users/42")).toBe("admin");
    expect(resolveNavContext("/admin/teams/7")).toBe("admin");
    expect(resolveNavContext("/admin/licenses")).toBe("admin");
    expect(resolveNavContext("/admin/login")).toBe("public");
  });

  it("flags minimal chrome paths", () => {
    expect(isMinimalChromePath("/app/login")).toBe(true);
    expect(isMinimalChromePath("/admin/login")).toBe(true);
    expect(shouldShowShellNav("/app/login")).toBe(false);
    expect(shouldShowShellNav("/app")).toBe(true);
  });
});
