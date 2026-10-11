"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";

export default function AirlineDashboardPage() {
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const isAdmin =
    isAuthenticated &&
    user?.userType === "AIRLINE_USER" &&
    user.role === "ADMIN";

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.replace("/");
    }
  }, [isLoading, isAdmin, router]);

  if (isLoading || !isAdmin) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 text-sm text-gray-500">
        Loading your airline dashboard...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <div>
            <p className="text-sm font-medium text-blue-700">
              Airline operations
            </p>
            <h1 className="mt-1 text-xl font-bold">Airline Dashboard</h1>
          </div>

          <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-800">
            Administrator
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="rounded-2xl bg-blue-800 px-6 py-8 text-white sm:px-10 sm:py-12">
          <p className="text-sm font-medium text-blue-200">
            Administration workspace
          </p>

          <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
            Manage your airline operations.
          </h2>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-blue-100 sm:text-base">
            Manage staff access and continue setting up your airline booking and
            operations platform.
          </p>

          <Link
            href="/airline/staff"
            className="mt-7 inline-flex items-center rounded-lg bg-white px-5 py-3 text-sm font-semibold text-blue-800 transition hover:bg-blue-50"
          >
            Manage staff
            <span aria-hidden="true" className="ml-2">
              →
            </span>
          </Link>
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <Link
            href="/airline/staff"
            className="group rounded-xl border border-gray-200 bg-white p-6 transition hover:border-blue-300 hover:shadow-sm"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-xl text-blue-800">
              ♙
            </div>

            <h3 className="mt-5 font-semibold group-hover:text-blue-800">
              Staff management
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Create staff accounts, update details, and remove access when
              necessary.
            </p>

            <p className="mt-5 text-sm font-semibold text-blue-700">
              Open staff management →
            </p>
          </Link>

          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gray-100 text-xl">
              ✈
            </div>

            <h3 className="mt-5 font-semibold">Flight operations</h3>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              A place for flight scheduling and management as those features are
              implemented.
            </p>

            <span className="mt-5 inline-block text-xs font-medium text-gray-500">
              Not implemented yet
            </span>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gray-100 text-xl">
              ▤
            </div>

            <h3 className="mt-5 font-semibold">Bookings</h3>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              A future workspace for viewing and managing passenger bookings.
            </p>

            <span className="mt-5 inline-block text-xs font-medium text-gray-500">
              Not implemented yet
            </span>
          </div>
        </section>
      </div>
    </main>
  );
}
