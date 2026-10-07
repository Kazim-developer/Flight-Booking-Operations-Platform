"use client";

import { postFormData } from "@/handlers/postFormData";
import { hasErrors } from "@/utils/hasErrors.util";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import ShowPasswordCheckbox from "./ShowPasswordCheckbox";

export interface AIRLINELOGIN {
  email: string;
  password: string;
}

export default function AirlineLoginForm() {
  const [formData, setFormData] = useState<AIRLINELOGIN>({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);

  const emailRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (formData: AIRLINELOGIN) =>
      postFormData("auth/airline-login", formData),
    onSuccess: async () => {
      toast.success("Logged In Successfully");

      await queryClient.refetchQueries({
        queryKey: ["auth", "me"],
      });

      router.replace("/");
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
    emailRef.current?.focus();
  }, []);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        mutate(formData);
      }}
      className="space-y-5"
    >
      <div>
        <label
          htmlFor="airline-email"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Contact email
        </label>

        <input
          id="airline-email"
          type="email"
          ref={emailRef}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="contact@airline.com"
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
        />
      </div>

      <div>
        <label
          htmlFor="airline-password"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Password
        </label>

        <input
          id="airline-password"
          type={showPassword ? "text" : "password"}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          placeholder="Enter your password"
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
        />
      </div>

      <ShowPasswordCheckbox
        showPassword={showPassword}
        setShowPassword={setShowPassword}
      />

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-lg bg-gray-900 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Logging in ..." : "Login"}
      </button>
    </form>
  );
}
