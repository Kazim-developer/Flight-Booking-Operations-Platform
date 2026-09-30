"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex h-screen items-center justify-center flex-col">
      <h1 className="text-2xl font-semibold">Something went wrong</h1>
      <p className="text-gray-500 mt-2">{error.message}</p>

      <button
        onClick={() => reset()}
        className="mt-4 px-4 py-2 bg-black text-white rounded"
      >
        Try again
      </button>
    </div>
  );
}
