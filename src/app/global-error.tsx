"use client";

export default function GlobalRootError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
          <h1 className="text-[28px] font-semibold">Something went wrong</h1>
          <p className="mt-3 text-[14px] leading-7 text-black/65">Please try again in a moment.</p>
          <button
            type="button"
            onClick={reset}
            className="mt-6 rounded-xl bg-black px-5 py-3 text-[14px] font-semibold text-white"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
