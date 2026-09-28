"use client";

import { FormEvent } from "react";

export default function AirlineForm() {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // We will connect this to NestJS later.
    console.log("Airline registration submitted");
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">
          Airline company registration
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Create an account to manage your airline operations.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Airline name */}
        <div>
          <label
            htmlFor="airline-name"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Airline name
          </label>

          <input
            id="airline-name"
            name="airlineName"
            type="text"
            placeholder="Example Airlines"
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-gray-900"
          />
        </div>

        {/* Contact email */}
        <div>
          <label
            htmlFor="airline-email"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Contact email
          </label>

          <input
            id="airline-email"
            name="email"
            type="email"
            placeholder="contact@airline.com"
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-gray-900"
          />
        </div>

        {/* Phone */}
        <div>
          <label
            htmlFor="airline-phone"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Phone number
          </label>

          <input
            id="airline-phone"
            name="phone"
            type="tel"
            placeholder="+92 300 1234567"
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-gray-900"
          />
        </div>

        {/* IATA code */}
        <div>
          <label
            htmlFor="iata-code"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            IATA code
          </label>

          <input
            id="iata-code"
            name="iataCode"
            type="text"
            placeholder="e.g. PK"
            maxLength={2}
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm uppercase outline-none transition focus:border-gray-900"
          />
        </div>

        {/* Website */}
        <div>
          <label
            htmlFor="website"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Website
          </label>

          <input
            id="website"
            name="website"
            type="url"
            placeholder="https://airline.com"
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-gray-900"
          />
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="airline-password"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Password
          </label>

          <input
            id="airline-password"
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
          Create airline account
        </button>
      </form>
    </div>
  );
}
