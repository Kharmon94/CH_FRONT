import { describe, expect, it } from "vitest";
import { resolveApiBase } from "../services/api";

describe("resolveApiBase", () => {
  it("defaults to /api/v1 when unset", () => {
    expect(resolveApiBase()).toBe("/api/v1");
    expect(resolveApiBase("")).toBe("/api/v1");
  });

  it("appends /api/v1 to host-only URL", () => {
    expect(resolveApiBase("https://api.cursorhelp.com")).toBe(
      "https://api.cursorhelp.com/api/v1"
    );
    expect(resolveApiBase("http://127.0.0.1:3000")).toBe("http://127.0.0.1:3000/api/v1");
  });

  it("leaves full /api/v1 base unchanged", () => {
    expect(resolveApiBase("https://api.cursorhelp.com/api/v1")).toBe(
      "https://api.cursorhelp.com/api/v1"
    );
  });

  it("strips trailing slash before normalizing", () => {
    expect(resolveApiBase("https://api.cursorhelp.com/")).toBe(
      "https://api.cursorhelp.com/api/v1"
    );
  });
});
