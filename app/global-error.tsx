"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          fontFamily: "system-ui, sans-serif",
          display: "flex",
          minHeight: "100dvh",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "1rem",
        }}
      >
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>
            Case Vault is temporarily unavailable
          </h1>
          <p style={{ marginTop: "0.5rem", color: "#666" }}>
            A critical error occurred. Please try again.
          </p>
          <button
            onClick={reset}
            style={{
              marginTop: "1.5rem",
              padding: "0.5rem 1rem",
              borderRadius: "0.5rem",
              border: "1px solid #ccc",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
