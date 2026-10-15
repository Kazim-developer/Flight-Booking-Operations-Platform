"use client";

import { getData } from "@/handlers/getData";
import { postFormData } from "@/handlers/postFormData";
import { hasErrors } from "@/utils/hasErrors.util";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FormEvent, useState } from "react";
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
  airline: {
    airlineName: string;
    iataCode: string;
  };
}

interface Booking {
  id: string;
  bookingReference: string;
  seatCount: number;
  totalPrice: number;
  status: string;
  flight: {
    flightNumber: string;
    origin: string;
    destination: string;
    departureAt: string;
    arrivalAt: string;
  };
}

interface SearchFlightsParams {
  origin: string;
  destination: string;
  departureDate: string;
}

export interface CreateBookingData {
  flightId: string;
  seatCount: number;
}

function formatDate(date: string) {
  return new Date(date).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function formatPrice(price: number) {
  return `PKR ${price.toLocaleString()}`;
}

export default function TravelerFlightsPage() {
  const queryClient = useQueryClient();

  const [searchParams, setSearchParams] = useState<SearchFlightsParams>({
    origin: "",
    destination: "",
    departureDate: "",
  });

  const [activeSearch, setActiveSearch] = useState<SearchFlightsParams>({
    origin: "",
    destination: "",
    departureDate: "",
  });

  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [seatCount, setSeatCount] = useState(1);

  const searchQuery = new URLSearchParams();

  if (activeSearch.origin.trim()) {
    searchQuery.set("origin", activeSearch.origin.trim());
  }

  if (activeSearch.destination.trim()) {
    searchQuery.set("destination", activeSearch.destination.trim());
  }

  if (activeSearch.departureDate) {
    searchQuery.set("departureDate", activeSearch.departureDate);
  }

  const flightsQuery = useQuery({
    queryKey: ["traveler", "flights", activeSearch],
    queryFn: () =>
      getData(
        `traveler/flights${searchQuery.size ? `?${searchQuery.toString()}` : ""}`,
      ),
  });

  const bookingsQuery = useQuery({
    queryKey: ["traveler", "bookings"],
    queryFn: () => getData("traveler/bookings"),
  });

  const bookingMutation = useMutation({
    mutationFn: (data: CreateBookingData) =>
      postFormData("traveler/bookings", data),

    onSuccess: async (response) => {
      const booking = response as Booking;

      toast.success(
        `Booking confirmed! Reference: ${booking.bookingReference}`,
      );

      setSelectedFlight(null);
      setSeatCount(1);

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["traveler", "flights"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["traveler", "bookings"],
        }),
      ]);
    },

    onError: (error) => {
      if (hasErrors(error)) {
        Object.values(error.errors).forEach((message) => {
          toast.error(String(message));
        });
      } else {
        toast.error(error.message || "Unable to book this flight");
      }
    },
  });

  const flights = flightsQuery.data ?? [];
  const bookings = bookingsQuery.data ?? [];

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSelectedFlight(null);
    setActiveSearch({ ...searchParams });
  }

  function handleBooking() {
    if (!selectedFlight) return;

    bookingMutation.mutate({
      flightId: selectedFlight.id,
      seatCount,
    });
  }

  console.log("flights: ", flights);
  console.log("bookings: ", bookings);

  return (
    <main className="mx-auto max-w-6xl space-y-10 px-4 py-10 sm:px-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
          Traveler Portal
        </p>

        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-gray-900">
          Find your next flight
        </h1>

        <p className="mt-2 text-sm text-gray-600">
          Search available flights, reserve your seats, and manage your
          bookings.
        </p>
      </header>

      {/* Flight search */}
      <section className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-gray-900">Search flights</h2>

        <form
          onSubmit={handleSearch}
          className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          <div>
            <label
              htmlFor="origin"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              From
            </label>

            <input
              id="origin"
              value={searchParams.origin}
              onChange={(event) =>
                setSearchParams({
                  ...searchParams,
                  origin: event.target.value,
                })
              }
              placeholder="e.g. Karachi"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
            />
          </div>

          <div>
            <label
              htmlFor="destination"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              To
            </label>

            <input
              id="destination"
              value={searchParams.destination}
              onChange={(event) =>
                setSearchParams({
                  ...searchParams,
                  destination: event.target.value,
                })
              }
              placeholder="e.g. Lahore"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
            />
          </div>

          <div>
            <label
              htmlFor="departureDate"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Departure date
            </label>

            <input
              id="departureDate"
              type="date"
              min={new Date().toLocaleDateString("en-CA")}
              value={searchParams.departureDate}
              onChange={(event) =>
                setSearchParams({
                  ...searchParams,
                  departureDate: event.target.value,
                })
              }
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={flightsQuery.isFetching}
              className="w-full rounded-lg bg-gray-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {flightsQuery.isFetching ? "Searching ..." : "Search flights"}
            </button>
          </div>
        </form>
      </section>

      {/* Available flights */}
      <section>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold text-gray-900">
            Available flights
          </h2>

          <span className="text-sm text-gray-500">
            {flights.length} {flights.length === 1 ? "flight" : "flights"}
          </span>
        </div>

        {flightsQuery.isLoading && (
          <p className="mt-5 text-sm text-gray-500">Loading flights ...</p>
        )}

        {flightsQuery.isError && (
          <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {flightsQuery.error.message}
          </div>
        )}

        {!flightsQuery.isLoading &&
          !flightsQuery.isError &&
          flights.length === 0 && (
            <div className="mt-5 rounded-xl border border-dashed border-gray-300 p-10 text-center">
              <h3 className="font-medium text-gray-900">No flights found</h3>
              <p className="mt-2 text-sm text-gray-500">
                Try another route or departure date.
              </p>
            </div>
          )}

        <div className="mt-5 space-y-4">
          {flights.map((flight) => (
            <article
              key={flight.id}
              className="rounded-xl border border-gray-200 bg-white p-5 transition hover:border-gray-400 sm:p-6"
            >
              <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-500">
                    {flight.airline.airlineName} ({flight.airline.iataCode})
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-900">
                    {flight.flightNumber}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-5">
                    <div>
                      <p className="text-xl font-semibold text-gray-900">
                        {flight.origin}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        {formatDate(flight.departureAt)}
                      </p>
                    </div>

                    <span className="text-gray-400">→</span>

                    <div>
                      <p className="text-xl font-semibold text-gray-900">
                        {flight.destination}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        {formatDate(flight.arrivalAt)}
                      </p>
                    </div>
                  </div>

                  <p className="mt-3 text-sm text-gray-500">
                    {flight.availableSeats} seats available
                  </p>
                </div>

                <div className="flex items-center justify-between gap-5 border-t border-gray-100 pt-4 md:flex-col md:items-end md:border-0 md:pt-0">
                  <div className="md:text-right">
                    <p className="text-2xl font-semibold text-gray-900">
                      {formatPrice(flight.price)}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">per seat</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFlight(flight);
                      setSeatCount(1);
                      bookingMutation.reset();
                    }}
                    className="rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
                  >
                    Select flight
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Booking confirmation */}
      {selectedFlight && (
        <section className="rounded-xl border border-gray-200 bg-gray-50 p-5 sm:p-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Confirm your booking
          </h2>

          <p className="mt-2 text-sm text-gray-600">
            {selectedFlight.flightNumber}: {selectedFlight.origin} →{" "}
            {selectedFlight.destination}
          </p>

          <p className="mt-1 text-sm text-gray-500">
            Departure: {formatDate(selectedFlight.departureAt)}
          </p>

          <div className="mt-5 max-w-sm">
            <label
              htmlFor="seatCount"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Number of seats
            </label>

            <select
              id="seatCount"
              value={seatCount}
              onChange={(event) => setSeatCount(Number(event.target.value))}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
            >
              {Array.from(
                { length: Math.min(9, selectedFlight.availableSeats) },
                (_, index) => index + 1,
              ).map((count) => (
                <option key={count} value={count}>
                  {count} {count === 1 ? "seat" : "seats"}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-gray-200 pt-4">
            <span className="text-sm text-gray-600">Total price</span>
            <span className="text-xl font-semibold text-gray-900">
              {formatPrice(selectedFlight.price * seatCount)}
            </span>
          </div>

          {bookingMutation.isError && (
            <p className="mt-4 text-sm text-red-600">
              {bookingMutation.error.message}
            </p>
          )}

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleBooking}
              disabled={bookingMutation.isPending}
              className="rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {bookingMutation.isPending ? "Booking ..." : "Confirm booking"}
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedFlight(null);
                bookingMutation.reset();
              }}
              className="rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </section>
      )}

      {/* Booking history */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900">My bookings</h2>

        {bookingsQuery.isLoading && (
          <p className="mt-4 text-sm text-gray-500">
            Loading your bookings ...
          </p>
        )}

        {bookingsQuery.isError && (
          <p className="mt-4 text-sm text-red-600">
            {bookingsQuery.error.message}
          </p>
        )}

        {!bookingsQuery.isLoading &&
          !bookingsQuery.isError &&
          bookings.length === 0 && (
            <p className="mt-4 rounded-xl border border-dashed border-gray-300 p-8 text-sm text-gray-500">
              You have not booked any flights yet.
            </p>
          )}

        <div className="mt-5 space-y-4">
          {bookings.map((booking) => (
            <article
              key={booking.id}
              className="rounded-xl border border-gray-200 bg-white p-5"
            >
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div>
                  <p className="font-semibold text-gray-900">
                    {booking.flight.origin} → {booking.flight.destination}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    {booking.flight.flightNumber} ·{" "}
                    {formatDate(booking.flight.departureAt)}
                  </p>

                  <p className="mt-3 text-sm text-gray-600">
                    Booking reference
                  </p>

                  <p className="font-mono text-sm font-semibold text-gray-900">
                    {booking.bookingReference}
                  </p>

                  <p className="mt-2 text-sm text-gray-500">
                    {booking.seatCount}{" "}
                    {booking.seatCount === 1 ? "seat" : "seats"}
                  </p>
                </div>

                <div className="sm:text-right">
                  <p className="font-semibold text-gray-900">
                    {formatPrice(booking.totalPrice)}
                  </p>

                  <span className="mt-2 inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                    {booking.status}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
