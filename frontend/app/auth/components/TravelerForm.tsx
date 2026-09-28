"use client";

import clsx from "clsx";
import { useState } from "react";
import ShowPasswordCheckbox from "./ShowPasswordCheckbox";

interface TRAVELERFORM {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}

export default function TravelerForm() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [travelerForm, setTravelerForm] = useState<TRAVELERFORM>({
    fullName: "",
    email: "",
    phone: "",
    password: "",
  });

  return (
    <div>
      <div className={clsx("flex flex-col gap-5")}>
        <div className={clsx("flex flex-col items-center gap-3")}>
          <h2 className="text-2xl font-semibold text-gray-900">
            Traveler registration
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Create your account to start booking flights.
          </p>
        </div>

        <form className={clsx("flex flex-col gap-5")}>
          {/* Full name */}
          <div>
            <label
              htmlFor="fullName"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Full name *
            </label>

            <input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="Ali Raza"
              required
              className={clsx(
                "w-[100%] p-2 focus:outline-none focus:border-black border-1 border-[#ccc] rounded-lg",
              )}
              onChange={(e) =>
                setTravelerForm({ ...travelerForm, fullName: e.target.value })
              }
            />
          </div>
          {/* Email */}
          <div>
            <label
              htmlFor="traveler-email"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Email address *
            </label>

            <input
              id="traveler-email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              className={clsx(
                "w-[100%] p-2 focus:outline-none focus:border-black border-1 border-[#ccc] rounded-lg",
              )}
              onChange={(e) =>
                setTravelerForm({ ...travelerForm, email: e.target.value })
              }
            />
          </div>
          {/* Phone */}
          <div>
            <label
              htmlFor="traveler-phone"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Phone number *
            </label>

            <input
              id="traveler-phone"
              name="phone"
              type="tel"
              placeholder="+92 300 1234567"
              required
              className={clsx(
                "w-[100%] p-2 focus:outline-none focus:border-black border-1 border-[#ccc] rounded-lg",
              )}
              onChange={(e) =>
                setTravelerForm({ ...travelerForm, phone: e.target.value })
              }
            />
          </div>
          {/* Password */}
          <div>
            <label
              htmlFor="traveler-password"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Password *
            </label>

            <input
              id="traveler-password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
              required
              className={clsx(
                "w-[100%] p-2 focus:outline-none focus:border-black border-1 border-[#ccc] rounded-lg",
              )}
              onChange={(e) =>
                setTravelerForm({ ...travelerForm, password: e.target.value })
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
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}
