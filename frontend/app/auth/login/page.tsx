"use client";

import { useState } from "react";
import Link from "next/link";

import TravelerLoginForm from "@/components/auth/TravelerLoginForm";
import AirlineLoginForm from "@/components/auth/AirlineLoginForm";
import StaffLoginForm from "@/components/auth/StaffLoginForm";
import PublicOnlyRoute from "@/components/auth/PublicOnlyRoute";

type AccountType = "traveler" | "airline" | "staff";

export default function LoginPage() {
  const [accountType, setAccountType] = useState<AccountType>("traveler");

  const tabClass = (type: AccountType) =>
    `rounded-md py-2.5 text-sm font-medium transition ${
      accountType === type
        ? "bg-white text-gray-900 shadow-sm"
        : "text-gray-500 hover:text-gray-700"
    }`;

  return (
    <PublicOnlyRoute>
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-semibold text-gray-900">
                Welcome back
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Sign in to your account
              </p>
            </div>

            <div className="mb-6 grid grid-cols-3 gap-1 rounded-lg bg-gray-100 p-1">
              <button
                type="button"
                onClick={() => setAccountType("traveler")}
                className={tabClass("traveler")}
              >
                Traveler
              </button>

              <button
                type="button"
                onClick={() => setAccountType("airline")}
                className={tabClass("airline")}
              >
                Airline
              </button>

              <button
                type="button"
                onClick={() => setAccountType("staff")}
                className={tabClass("staff")}
              >
                Staff
              </button>
            </div>

            {accountType === "traveler" ? (
              <TravelerLoginForm />
            ) : accountType === "airline" ? (
              <AirlineLoginForm />
            ) : (
              <StaffLoginForm />
            )}

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Don&apos;t have an account?{" "}
                <Link
                  href="/auth/signup"
                  className="font-medium text-gray-900 hover:underline"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </PublicOnlyRoute>
  );
}
