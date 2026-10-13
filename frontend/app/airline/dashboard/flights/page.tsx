"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Flight {
  id: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departureAt: string;
  arrivalAt: string;
  price: number;
  totalSeats: number;
  availableSeats: number;
  status: "SCHEDULED" | "CANCELLED" | "COMPLETED";
}

interface FlightForm {
  flightNumber: string;
  origin: string;
  destination: string;
  departureAt: string;
  arrivalAt: string;
  price: string;
  totalSeats: string;
}

const initialForm: FlightForm = {
  flightNumber: "",
  origin: "",
  destination: "",
  departureAt: "",
  arrivalAt: "",
  price: "",
  totalSeats: "100",
};

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}/${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  const text = await response.text();
  let data: unknown = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!response.ok) {
    const message =
      typeof data === "object" && data !== null && "message" in data
        ? Array.isArray(data.message)
          ? data.message.join(", ")
          : String(data.message)
        : typeof data === "string"
          ? data
          : "Request failed";

    throw new Error(message);
  }

  return data as T;
}

function displayDate(value: string) {
  return new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function FlightsPage() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<FlightForm>(initialForm);

  const flightsQuery = useQuery({
    queryKey: ["airline", "flights"],
    queryFn: () => request<Flight[]>("flights/available"),
  });

  const createFlight = useMutation({
    mutationFn: (payload: object) =>
      request<Flight>("flights", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: async () => {
      toast.success("Flight created successfully");
      setForm(initialForm);
      await queryClient.invalidateQueries({
        queryKey: ["airline", "flights"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["airline", "available-flights"],
      });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const departureAt = new Date(form.departureAt);
    const arrivalAt = new Date(form.arrivalAt);
    const price = Number(form.price);
    const totalSeats = Number(form.totalSeats);

    if (
      !Number.isFinite(departureAt.getTime()) ||
      !Number.isFinite(arrivalAt.getTime()) ||
      departureAt <= new Date() ||
      arrivalAt <= departureAt
    ) {
      toast.error("Enter valid future departure and arrival times");
      return;
    }

    if (
      !Number.isFinite(price) ||
      price <= 0 ||
      !Number.isInteger(totalSeats) ||
      totalSeats < 1
    ) {
      toast.error("Enter a valid price and number of seats");
      return;
    }

    createFlight.mutate({
      flightNumber: form.flightNumber.trim().toUpperCase(),
      origin: form.origin.trim(),
      destination: form.destination.trim(),
      departureAt: departureAt.toISOString(),
      arrivalAt: arrivalAt.toISOString(),
      price,
      totalSeats,
    });
  }

  const inputClass =
    "w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900";

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
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/airline/dashboard"
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          ← Airline dashboard
        </Link>

        <div className="mb-8 mt-5">
          <h1 className="text-2xl font-semibold text-gray-900">
            Flight Management
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Create flights and check seat availability.
          </p>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[380px_1fr]">
          <section className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Create flight
            </h2>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label
                  htmlFor="flightNumber"
                  className="mb-1.5 block text-sm font-medium"
                >
                  Flight number
                </label>
                <input
                  id="flightNumber"
                  required
                  maxLength={20}
                  value={form.flightNumber}
                  onChange={(e) =>
                    setForm({ ...form, flightNumber: e.target.value })
                  }
                  placeholder="PK301"
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="origin"
                    className="mb-1.5 block text-sm font-medium"
                  >
                    Origin
                  </label>
                  <input
                    id="origin"
                    required
                    minLength={3}
                    maxLength={100}
                    value={form.origin}
                    onChange={(e) =>
                      setForm({ ...form, origin: e.target.value })
                    }
                    placeholder="Karachi"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label
                    htmlFor="destination"
                    className="mb-1.5 block text-sm font-medium"
                  >
                    Destination
                  </label>
                  <input
                    id="destination"
                    required
                    minLength={3}
                    maxLength={100}
                    value={form.destination}
                    onChange={(e) =>
                      setForm({ ...form, destination: e.target.value })
                    }
                    placeholder="Lahore"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="departureAt"
                  className="mb-1.5 block text-sm font-medium"
                >
                  Departure
                </label>
                <input
                  id="departureAt"
                  type="datetime-local"
                  required
                  value={form.departureAt}
                  onChange={(e) =>
                    setForm({ ...form, departureAt: e.target.value })
                  }
                  className={inputClass}
                />
              </div>

              <div>
                <label
                  htmlFor="arrivalAt"
                  className="mb-1.5 block text-sm font-medium"
                >
                  Arrival
                </label>
                <input
                  id="arrivalAt"
                  type="datetime-local"
                  required
                  value={form.arrivalAt}
                  onChange={(e) =>
                    setForm({ ...form, arrivalAt: e.target.value })
                  }
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="price"
                    className="mb-1.5 block text-sm font-medium"
                  >
                    Price (PKR)
                  </label>
                  <input
                    id="price"
                    type="number"
                    min="1"
                    step="0.01"
                    required
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: e.target.value })
                    }
                    placeholder="15000"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label
                    htmlFor="totalSeats"
                    className="mb-1.5 block text-sm font-medium"
                  >
                    Total seats
                  </label>
                  <input
                    id="totalSeats"
                    type="number"
                    min="1"
                    max="1000"
                    step="1"
                    required
                    value={form.totalSeats}
                    onChange={(e) =>
                      setForm({ ...form, totalSeats: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={createFlight.isPending}
                className="w-full rounded-lg bg-gray-900 py-3 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-60"
              >
                {createFlight.isPending
                  ? "Creating flight..."
                  : "Create flight"}
              </button>
            </form>
          </section>

          <section className="min-w-0 rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Available flights
            </h2>

            {flightsQuery.isLoading ? (
              <p className="mt-6 text-sm text-gray-500">Loading flights...</p>
            ) : flightsQuery.isError ? (
              <p className="mt-6 text-sm text-red-600">
                {flightsQuery.error.message}
              </p>
            ) : flightsQuery.data.length === 0 ? (
              <p className="mt-6 text-sm text-gray-500">
                No future flights with available seats yet.
              </p>
            ) : (
              <div className="mt-5 space-y-3">
                {flightsQuery.data.map((flight) => (
                  <article
                    key={flight.id}
                    className="rounded-lg border border-gray-200 p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {flight.flightNumber}: {flight.origin} →{" "}
                          {flight.destination}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Departure: {displayDate(flight.departureAt)}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          Arrival: {displayDate(flight.arrivalAt)}
                        </p>
                      </div>
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                        {flight.availableSeats}/{flight.totalSeats} seats left
                      </span>
                    </div>
                    <p className="mt-3 text-sm font-medium text-gray-900">
                      {flight.price.toLocaleString()} PKR per seat
                    </p>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
