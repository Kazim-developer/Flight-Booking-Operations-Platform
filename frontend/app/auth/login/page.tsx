"use client";

import { useState } from "react";
import TravelerLoginForm from "@/components/auth/TravelerLoginForm";
import AirlineLoginForm from "@/components/auth/AirlineLoginForm";
import Link from "next/link";
import PublicOnlyRoute from "@/components/auth/PublicOnlyRoute";

type AccountType = "traveler" | "airline";

export default function LoginPage() {
  const [accountType, setAccountType] = useState<AccountType>("traveler");

  return (
    <PublicOnlyRoute>
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-semibold text-gray-900">
                Welcome back
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Sign in to your account
              </p>
            </div>

            <div className="grid grid-cols-2 gap-1 p-1 bg-gray-100 rounded-lg mb-6">
              <button
                type="button"
                onClick={() => setAccountType("traveler")}
                className={`py-2.5 rounded-md text-sm font-medium transition ${
                  accountType === "traveler"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Traveler
              </button>

              <button
                type="button"
                onClick={() => setAccountType("airline")}
                className={`py-2.5 rounded-md text-sm font-medium transition ${
                  accountType === "airline"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Airline
              </button>
            </div>

            {accountType === "traveler" ? (
              <TravelerLoginForm />
            ) : (
              <AirlineLoginForm />
            )}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Dont have an account?{" "}
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
