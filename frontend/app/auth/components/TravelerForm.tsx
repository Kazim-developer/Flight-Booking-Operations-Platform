"use client";

import { FormEvent } from "react";

export default function TravelerForm() {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // We will connect this to NestJS later.
    console.log("Traveler registration submitted");
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">
          Traveler registration
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Create your account to start booking flights.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Full name */}
        <div>
          <label
            htmlFor="fullName"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Full name
          </label>

          <input
            id="fullName"
            name="fullName"
            type="text"
            placeholder="Ali Raza"
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-gray-900"
          />
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="traveler-email"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Email address
          </label>

          <input
            id="traveler-email"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-gray-900"
          />
        </div>

        {/* Phone */}
        <div>
          <label
            htmlFor="traveler-phone"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Phone number
          </label>

          <input
            id="traveler-phone"
            name="phone"
            type="tel"
            placeholder="+92 300 1234567"
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-gray-900"
          />
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="traveler-password"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Password
          </label>

          <input
            id="traveler-password"
            name="password"
            type="password"
            placeholder="Create a password"
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-gray-900"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
        >
          Create traveler account
        </button>
      </form>
    </div>
  );
}
