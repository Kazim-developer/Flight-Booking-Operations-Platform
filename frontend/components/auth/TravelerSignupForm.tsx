"use client";

import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import ShowPasswordCheckbox from "./ShowPasswordCheckbox";
import { useMutation } from "@tanstack/react-query";
import { postFormData } from "@/handlers/postFormData";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { hasErrors } from "@/utils/hasErrors.util";

export interface TRAVELERFORM {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}

export default function TravelerSignupForm() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [travelerForm, setTravelerForm] = useState<TRAVELERFORM>({
    fullName: "",
    email: "",
    phone: "",
    password: "",
  });

  const nameRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: (travelerForm: TRAVELERFORM) =>
      postFormData("auth/traveler-signup", travelerForm),
    onSuccess: () => {
      toast.success("account has been created successfully, redirecting ...");
      setTimeout(() => {
        router.replace("/auth/login");
      }, 3000);
    },
    onError: (error) => {
      if (hasErrors(error)) {
        Object.values(error.errors).forEach((msg) => {
          toast.error(String(msg));
        });
      } else {
        toast.error(error.message || "Something went wrong");
      }
    },
  });

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

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

        <form
          className={clsx("flex flex-col gap-5")}
          onSubmit={(e) => {
            e.preventDefault();
            mutate(travelerForm);
          }}
        >
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
              ref={nameRef}
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
            disabled={isPending}
            className={clsx(
              "bg-black text-white p-3 text-bold cursor-pointer rounded-lg transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60",
            )}
          >
            {isPending ? "Signing in ..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}
