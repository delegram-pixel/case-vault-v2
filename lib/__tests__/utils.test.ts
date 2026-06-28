import { describe, it, expect } from "vitest";
import { cn, initials, formatDate } from "../utils";

describe("cn", () => {
  it("merges conflicting tailwind classes (last wins)", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });
  it("keeps non-conflicting classes and drops falsy values", () => {
    expect(cn("text-sm", false, undefined, "font-bold")).toBe("text-sm font-bold");
  });
});

describe("initials", () => {
  it("takes the first two name parts", () => {
    expect(initials("Funke Adebayo")).toBe("FA");
    expect(initials("System Administrator")).toBe("SA");
  });
  it("handles a single name", () => {
    expect(initials("Madonna")).toBe("M");
  });
  it("uppercases", () => {
    expect(initials("jane doe")).toBe("JD");
  });
});

describe("formatDate", () => {
  it("formats an ISO date into a readable string with the year", () => {
    const out = formatDate("2026-02-12");
    expect(out).toContain("2026");
    expect(typeof out).toBe("string");
  });
});
