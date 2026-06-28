import { describe, it, expect } from "vitest";
import {
  loginSchema,
  registerSchema,
  caseSchema,
  createUserSchema,
  resetSchema,
} from "../validations";

describe("loginSchema", () => {
  it("accepts a valid email + password", () => {
    expect(loginSchema.safeParse({ email: "a@b.com", password: "x" }).success).toBe(true);
  });
  it("rejects an invalid email", () => {
    expect(loginSchema.safeParse({ email: "nope", password: "x" }).success).toBe(false);
  });
  it("rejects an empty password", () => {
    expect(loginSchema.safeParse({ email: "a@b.com", password: "" }).success).toBe(false);
  });
});

describe("registerSchema", () => {
  it("accepts a clerk without a bar number", () => {
    const r = registerSchema.safeParse({
      name: "Jane Doe",
      email: "jane@court.gov.ng",
      password: "password123",
      role: "CLERK",
    });
    expect(r.success).toBe(true);
  });

  it("requires a bar number for attorneys", () => {
    const r = registerSchema.safeParse({
      name: "Jane Doe",
      email: "jane@law.ng",
      password: "password123",
      role: "ATTORNEY",
    });
    expect(r.success).toBe(false);
  });

  it("accepts an attorney with a bar number", () => {
    const r = registerSchema.safeParse({
      name: "Jane Doe",
      email: "jane@law.ng",
      password: "password123",
      role: "ATTORNEY",
      barNumber: "SCN/12345",
    });
    expect(r.success).toBe(true);
  });

  it("rejects short passwords", () => {
    const r = registerSchema.safeParse({
      name: "Jane",
      email: "jane@court.gov.ng",
      password: "short",
      role: "CLERK",
    });
    expect(r.success).toBe(false);
  });
});

describe("caseSchema", () => {
  const base = {
    caseNumber: "LD/0001/2026",
    title: "Adeyemi v. Crestwood",
    description: "A breach of contract claim.",
    status: "Open" as const,
    courtType: "High Court",
    courtState: "Lagos",
    judge: "Hon. Justice Bello",
    attorneys: [],
  };

  it("accepts a valid case with at least one party", () => {
    const r = caseSchema.safeParse({
      ...base,
      parties: [{ name: "Tunde", role: "Plaintiff" }],
    });
    expect(r.success).toBe(true);
  });

  it("requires at least one party", () => {
    const r = caseSchema.safeParse({ ...base, parties: [] });
    expect(r.success).toBe(false);
  });

  it("rejects a too-short title", () => {
    const r = caseSchema.safeParse({
      ...base,
      title: "abc",
      parties: [{ name: "Tunde", role: "Plaintiff" }],
    });
    expect(r.success).toBe(false);
  });
});

describe("createUserSchema", () => {
  it("accepts the four staff roles", () => {
    for (const role of ["CLERK", "JUDGE", "ATTORNEY", "ADMIN"] as const) {
      const r = createUserSchema.safeParse({
        name: "X Y",
        email: "x@court.gov.ng",
        password: "password123",
        role,
      });
      expect(r.success, role).toBe(true);
    }
  });

  it("rejects an unknown role", () => {
    const r = createUserSchema.safeParse({
      name: "X Y",
      email: "x@court.gov.ng",
      password: "password123",
      role: "SUPERUSER",
    });
    expect(r.success).toBe(false);
  });
});

describe("resetSchema", () => {
  it("requires an 8+ char password and a real token", () => {
    expect(resetSchema.safeParse({ token: "abcdefghij", password: "longenough" }).success).toBe(true);
    expect(resetSchema.safeParse({ token: "short", password: "longenough" }).success).toBe(false);
    expect(resetSchema.safeParse({ token: "abcdefghij", password: "short" }).success).toBe(false);
  });
});
