"use client";

import { useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

interface Flight {
  id: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departureAt: string;
  arrivalAt: string;
  price: number;
  availableSeats: number;
}

interface Booking {
  id: string;
  bookingReference: string;
  passengerFullName: string;
  totalPrice: number;
  seatCount: number;
}

interface BookingForm {
  flightId: string;
  passengerFullName: string;
  passengerEmail: string;
  passengerPhone: string;
  seatCount: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function apiRequest<T>(path: string, options?: RequestInit): Promise<T> {
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
        ? String(data.message)
        : typeof data === "string"
          ? data
          : "Request failed";

    throw new Error(message);
  }

  return data as T;
}

function formatDate(value: string) {
  return new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function NewBookingPage() {
  const queryClient = useQueryClient();

  const [form, setForm] = useState<BookingForm>({
    flightId: "",
    passengerFullName: "",
    passengerEmail: "",
    passengerPhone: "",
    seatCount: 1,
  });

  const {
    data: flights = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["airline", "available-flights"],
    queryFn: () => apiRequest<Flight[]>("flights/available"),
  });

  const selectedFlight = useMemo(
    () => flights.find((flight) => flight.id === form.flightId),
    [flights, form.flightId],
  );

  const mutation = useMutation({
    mutationFn: (payload: BookingForm) =>
      apiRequest<Booking>("airline/staff/bookings", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: async (booking) => {
      toast.success("Booking created successfully");

      await queryClient.invalidateQueries({
        queryKey: ["airline", "available-flights"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["airline", "staff-bookings"],
      });

      setForm({
        flightId: "",
        passengerFullName: "",
        passengerEmail: "",
        passengerPhone: "",
        seatCount: 1,
      });

      toast.info(`Booking reference: ${booking.bookingReference}`, {
        autoClose: 8000,
      });
    },
    onError: (err: Error) => {
      toast.error(err.message || "Unable to create booking");
    },
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedFlight) {
      toast.error("Please select a flight");
      return;
    }

    if (form.seatCount > selectedFlight.availableSeats) {
      toast.error("The selected flight does not have enough seats");
      return;
    }

    mutation.mutate(form);
  }

  const inputClass =
    "w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900";

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/airline/staff/dashboard"
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          ← Back to dashboard
        </Link>

        <div className="mt-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            Create a booking
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Select an available flight and enter the passenger details.
          </p>

          {isLoading ? (
            <p className="mt-8 text-sm text-gray-500">Loading flights...</p>
          ) : isError ? (
            <p className="mt-8 text-sm text-red-600">
              {error instanceof Error
                ? error.message
                : "Could not load flights"}
            </p>
          ) : flights.length === 0 ? (
            <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-5">
              <p className="font-medium text-gray-900">No available flights</p>
              <p className="mt-2 text-sm text-gray-600">
                Your airline needs a scheduled flight with a future departure
                and available seats before you can create a booking.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label
                  htmlFor="flightId"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Flight
                </label>
                <select
                  id="flightId"
                  required
                  value={form.flightId}
                  onChange={(event) => {
                    setForm({
                      ...form,
                      flightId: event.target.value,
                    });
                  }}
                  className={inputClass}
                >
                  <option value="">Select a flight</option>
                  {flights.map((flight) => (
                    <option key={flight.id} value={flight.id}>
                      {flight.flightNumber} — {flight.origin} to{" "}
                      {flight.destination} — {formatDate(flight.departureAt)}
                    </option>
                  ))}
                </select>
              </div>

              {selectedFlight && (
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <div className="flex flex-wrap justify-between gap-3">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {selectedFlight.origin} → {selectedFlight.destination}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        Flight {selectedFlight.flightNumber}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600">
                      {selectedFlight.availableSeats} seats available
                    </p>
                  </div>
                  <div className="mt-3 grid gap-2 text-sm text-gray-600 sm:grid-cols-2">
                    <p>Departure: {formatDate(selectedFlight.departureAt)}</p>
                    <p>Arrival: {formatDate(selectedFlight.arrivalAt)}</p>
                    <p>
                      Price per seat:{" "}
                      {selectedFlight.price.toLocaleString(undefined, {
                        style: "currency",
                        currency: "PKR",
                      })}
                    </p>
                  </div>
                </div>
              )}

              <div>
                <label
                  htmlFor="passengerFullName"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Passenger full name
                </label>
                <input
                  id="passengerFullName"
                  required
                  maxLength={100}
                  value={form.passengerFullName}
                  onChange={(event) =>
                    setForm({ ...form, passengerFullName: event.target.value })
                  }
                  placeholder="Passenger's full name"
                  className={inputClass}
                />
              </div>

              <div>
                <label
                  htmlFor="passengerEmail"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Passenger email
                </label>
                <input
                  id="passengerEmail"
                  type="email"
                  required
                  maxLength={254}
                  value={form.passengerEmail}
                  onChange={(event) =>
                    setForm({ ...form, passengerEmail: event.target.value })
                  }
                  placeholder="passenger@example.com"
                  className={inputClass}
                />
              </div>

              <div>
                <label
                  htmlFor="passengerPhone"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Passenger phone
                </label>
                <input
                  id="passengerPhone"
                  type="tel"
                  required
                  minLength={5}
                  maxLength={30}
                  value={form.passengerPhone}
                  onChange={(event) =>
                    setForm({ ...form, passengerPhone: event.target.value })
                  }
                  placeholder="+92..."
                  className={inputClass}
                />
              </div>

              <div>
                <label
                  htmlFor="seatCount"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Number of seats
                </label>
                <input
                  id="seatCount"
                  type="number"
                  min={1}
                  max={Math.min(9, selectedFlight?.availableSeats ?? 9)}
                  required
                  value={form.seatCount}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      seatCount: Number(event.target.value),
                    })
                  }
                  className={inputClass}
                />
              </div>

              {selectedFlight && form.seatCount >= 1 && (
                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
                  <span className="text-sm font-medium text-gray-700">
                    Total price
                  </span>
                  <span className="text-lg font-semibold text-gray-900">
                    {(selectedFlight.price * form.seatCount).toLocaleString(
                      undefined,
                      { style: "currency", currency: "PKR" },
                    )}
                  </span>
                </div>
              )}

              <button
                type="submit"
                disabled={
                  mutation.isPending ||
                  !selectedFlight ||
                  form.seatCount < 1 ||
                  form.seatCount > (selectedFlight?.availableSeats ?? 0)
                }
                className="w-full rounded-lg bg-gray-900 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {mutation.isPending ? "Creating booking..." : "Confirm booking"}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
