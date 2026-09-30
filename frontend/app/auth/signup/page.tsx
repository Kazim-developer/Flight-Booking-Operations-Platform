"use client";

import { useState } from "react";
import TravelerForm from "../components/TravelerForm";
import AirlineForm from "../components/AirlineForm";

type UserType = "traveler" | "airline" | null;

export default function AuthPage() {
  const [userType, setUserType] = useState<UserType>(null);

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
            Create your account
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Choose how you want to use the platform
          </p>
        </div>

        {!userType ? (
          /* Role selection */
          <div className="grid gap-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setUserType("traveler")}
              className="rounded-xl border border-gray-200 bg-white p-6 text-left transition hover:border-black hover:shadow-sm"
            >
              <div className="mb-4 text-2xl">✈️</div>

              <h2 className="text-lg font-semibold text-gray-900">Traveler</h2>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Book flights, manage your trips, and explore destinations.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setUserType("airline")}
              className="rounded-xl border border-gray-200 bg-white p-6 text-left transition hover:border-black hover:shadow-sm"
            >
              <div className="mb-4 text-2xl">🏢</div>

              <h2 className="text-lg font-semibold text-gray-900">
                Airline Company
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Manage flights, aircraft, operations, and customers.
              </p>
            </button>
          </div>
        ) : (
          /* Selected registration form */
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            <button
              type="button"
              onClick={() => setUserType(null)}
              className="mb-6 text-sm text-gray-500 transition hover:text-gray-900 cursor-pointer"
            >
              ← Back
            </button>

            {userType === "traveler" ? <TravelerForm /> : <AirlineForm />}
          </div>
        )}
      </div>
    </main>
  );
}
