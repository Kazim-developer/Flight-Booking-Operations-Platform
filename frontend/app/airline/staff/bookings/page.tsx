"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

interface Booking {
  id: string;
  bookingReference: string;
  passengerFullName: string;
  passengerEmail: string;
  passengerPhone: string;
  seatCount: number;
  totalPrice: number;
  status: "CONFIRMED" | "CANCELLED";
  createdAt: string;
  flight: {
    flightNumber: string;
    origin: string;
    destination: string;
    departureAt: string;
  };
}

export default function StaffBookingsPage() {
  const {
    data = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["airline", "staff-bookings"],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/airline/staff/bookings`,
        { credentials: "include" },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof result.message === "string"
            ? result.message
            : "Unable to load bookings",
        );
      }

      return result as Booking[];
    },
  });

  const formatDate = (date: string) =>
    new Date(date).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/airline/staff/dashboard"
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          ← Back to dashboard
        </Link>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Bookings</h1>
            <p className="mt-2 text-sm text-gray-500">
              Reservations created by staff for your airline.
            </p>
          </div>

          <Link
            href="/airline/staff/bookings/new"
            className="rounded-lg bg-gray-900 px-4 py-3 text-sm font-medium text-white hover:bg-gray-800"
          >
            Create booking
          </Link>
        </div>

        {isLoading ? (
          <p className="mt-8 text-sm text-gray-500">Loading bookings...</p>
        ) : isError ? (
          <p className="mt-8 text-sm text-red-600">
            {error instanceof Error ? error.message : "Unable to load bookings"}
          </p>
        ) : data.length === 0 ? (
          <div className="mt-8 rounded-xl border border-gray-200 bg-white p-8 text-center">
            <p className="font-medium text-gray-900">No bookings yet</p>
            <p className="mt-2 text-sm text-gray-500">
              Create your first booking to see it listed here.
            </p>
          </div>
        ) : (
          <div className="mt-8 overflow-x-auto rounded-xl border border-gray-200 bg-white">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="border-b border-gray-200 bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-5 py-4 font-medium">Reference</th>
                  <th className="px-5 py-4 font-medium">Passenger</th>
                  <th className="px-5 py-4 font-medium">Flight</th>
                  <th className="px-5 py-4 font-medium">Departure</th>
                  <th className="px-5 py-4 font-medium">Seats</th>
                  <th className="px-5 py-4 font-medium">Total</th>
                  <th className="px-5 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.map((booking) => (
                  <tr key={booking.id}>
                    <td className="px-5 py-4 font-medium text-gray-900">
                      {booking.bookingReference.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-900">
                        {booking.passengerFullName}
                      </p>
                      <p className="mt-1 text-gray-500">
                        {booking.passengerEmail}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-900">
                        {booking.flight.flightNumber}
                      </p>
                      <p className="mt-1 text-gray-500">
                        {booking.flight.origin} → {booking.flight.destination}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      {formatDate(booking.flight.departureAt)}
                    </td>
                    <td className="px-5 py-4">{booking.seatCount}</td>
                    <td className="px-5 py-4">
                      {booking.totalPrice.toLocaleString(undefined, {
                        style: "currency",
                        currency: "PKR",
                      })}
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
