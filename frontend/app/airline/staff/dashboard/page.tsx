"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/auth.store";

export default function StaffDashboardPage() {
  const user = useAuthStore((state) => state.user);

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Airline Staff Dashboard
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage flight bookings and passenger reservations.
            </p>
          </div>

          <span className="rounded-full bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700">
            Staff
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900">Welcome back</h2>
          <p className="mt-2 text-sm text-gray-600">
            {user?.email ?? "Airline staff"} — manage your airline's
            reservations from here.
          </p>
        </section>

        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Create Booking
            </h3>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Find a flight, enter passenger details, and create a reservation.
            </p>
            <Link
              href="/airline/staff/bookings/new"
              className="mt-5 inline-flex rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              Create a booking
            </Link>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Manage Bookings
            </h3>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              View existing reservations and their booking statuses.
            </p>
            <Link
              href="/airline/staff/bookings"
              className="mt-5 inline-flex rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              View bookings
            </Link>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h3 className="text-lg font-semibold text-gray-900">Account</h3>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Signed in as airline staff.
            </p>
            <p className="mt-4 break-all text-sm text-gray-500">
              {user?.email ?? "Loading account..."}
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
