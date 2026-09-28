"use client";

import clsx from "clsx";
import { useState } from "react";
import ShowPasswordCheckbox from "./ShowPasswordCheckbox";

interface AIRLINEFORM {
  name: string;
  email: string;
  iaatCode: string;
  password: string;
}

export default function AirlineForm() {
  const [airlineForm, setAirlineForm] = useState<AIRLINEFORM>({
    name: "",
    email: "",
    iaatCode: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <div>
      <div className={clsx("flex flex-col gap-5")}>
        <div className={clsx("flex flex-col items-center gap-3")}>
          <h2 className="text-2xl font-semibold text-gray-900">
            Airline company registration
          </h2>

          <p className="text-sm text-gray-500">
            Create an account to manage your airline operations.
          </p>
        </div>

        <form className={clsx("flex flex-col gap-5")}>
          {/* Airline name */}
          <div>
            <label
              htmlFor="airline-name"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Airline name *
            </label>

            <input
              id="airline-name"
              name="airlineName"
              type="text"
              placeholder="Example Airlines"
              required
              className={clsx(
                "w-[100%] p-2 focus:outline-none focus:border-black border-1 border-[#ccc] rounded-lg",
              )}
              onChange={(e) =>
                setAirlineForm({ ...airlineForm, name: e.target.value })
              }
            />
          </div>

          {/* Contact email */}
          <div>
            <label
              htmlFor="airline-email"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Contact email *
            </label>

            <input
              id="airline-email"
              name="email"
              type="email"
              placeholder="contact@airline.com"
              required
              className={clsx(
                "w-[100%] p-2 focus:outline-none focus:border-black border-1 border-[#ccc] rounded-lg",
              )}
              onChange={(e) =>
                setAirlineForm({ ...airlineForm, email: e.target.value })
              }
            />
          </div>

          {/* IATA code */}
          <div>
            <label
              htmlFor="iata-code"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              IATA code *
            </label>

            <input
              id="iata-code"
              name="iataCode"
              type="text"
              placeholder="e.g. PK"
              maxLength={2}
              required
              className={clsx(
                "w-[100%] p-2 focus:outline-none focus:border-black border-1 border-[#ccc] rounded-lg",
              )}
              onChange={(e) =>
                setAirlineForm({ ...airlineForm, iaatCode: e.target.value })
              }
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="airline-password"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Password *
            </label>

            <input
              id="airline-password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
              required
              className={clsx(
                "w-[100%] p-2 focus:outline-none focus:border-black border-1 border-[#ccc] rounded-lg",
              )}
              onChange={(e) =>
                setAirlineForm({ ...airlineForm, password: e.target.value })
              }
            />
          </div>

          <ShowPasswordCheckbox
            showPassword={showPassword}
            setShowPassword={setShowPassword}
          />

          <button
            type="submit"
            className={clsx(
              "bg-black text-white p-3 text-bold cursor-pointer rounded-lg",
            )}
          >
            Create airline account
          </button>
        </form>
      </div>
    </div>
  );
}
