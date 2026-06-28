import { describe, it, expect, vi, afterEach } from "vitest";
import { rateLimit } from "../rate-limit";

afterEach(() => {
  vi.useRealTimers();
});

describe("rateLimit", () => {
  it("allows requests up to the limit, then blocks", () => {
    const key = `t1-${Math.random()}`;
    for (let i = 0; i < 5; i++) {
      expect(rateLimit(key, 5, 10_000).ok).toBe(true);
    }
    expect(rateLimit(key, 5, 10_000).ok).toBe(false);
  });

  it("tracks keys independently", () => {
    const a = `a-${Math.random()}`;
    const b = `b-${Math.random()}`;
    expect(rateLimit(a, 1, 10_000).ok).toBe(true);
    expect(rateLimit(a, 1, 10_000).ok).toBe(false);
    // b is unaffected by a's exhaustion
    expect(rateLimit(b, 1, 10_000).ok).toBe(true);
  });

  it("reports remaining budget", () => {
    const key = `t3-${Math.random()}`;
    expect(rateLimit(key, 3, 10_000).remaining).toBe(2);
    expect(rateLimit(key, 3, 10_000).remaining).toBe(1);
    expect(rateLimit(key, 3, 10_000).remaining).toBe(0);
  });

  it("resets after the window elapses", () => {
    vi.useFakeTimers();
    const key = `t4-${Math.random()}`;
    expect(rateLimit(key, 1, 1_000).ok).toBe(true);
    expect(rateLimit(key, 1, 1_000).ok).toBe(false);
    vi.advanceTimersByTime(1_500);
    expect(rateLimit(key, 1, 1_000).ok).toBe(true);
  });
});
