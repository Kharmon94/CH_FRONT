import { describe, expect, it } from "vitest";
import { isAbsoluteDatabasePath } from "../lib/localLinking";

describe("isAbsoluteDatabasePath", () => {
  it("accepts unix absolute paths", () => {
    expect(isAbsoluteDatabasePath("/mnt/c/Users/you/AppData/Roaming/Cursor/User/globalStorage/state.vscdb")).toBe(
      true
    );
  });

  it("accepts windows absolute paths", () => {
    expect(isAbsoluteDatabasePath("C:\\Users\\you\\AppData\\Roaming\\Cursor\\User\\globalStorage\\state.vscdb")).toBe(
      true
    );
  });

  it("rejects relative paths", () => {
    expect(isAbsoluteDatabasePath("../../Cursor/User/globalStorage/state.vscdb")).toBe(false);
  });
});
