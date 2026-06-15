import { describe, expect, it } from "vitest";
import { detectPlatform, getDownloadUrl } from "../lib/downloads";
import { parseDeepLink, isAuthDeepLink } from "../lib/deepLink";

describe("downloads", () => {
  it("detects a platform label", () => {
    expect(["windows", "mac", "linux", "unknown"]).toContain(detectPlatform());
  });

  it("returns null without env URLs", () => {
    expect(getDownloadUrl("windows")).toBeNull();
  });
});

describe("deepLink", () => {
  it("parses auth token", () => {
    const parsed = parseDeepLink("cursorhelp://auth?token=abc123");
    expect(isAuthDeepLink("cursorhelp://auth?token=abc123")).toBe(true);
    expect(parsed.token).toBe("abc123");
  });
});
