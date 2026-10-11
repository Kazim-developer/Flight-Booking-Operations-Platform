"use client";

import { postFormData } from "@/handlers/postFormData";
import { hasErrors } from "@/utils/hasErrors.util";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import ShowPasswordCheckbox from "./ShowPasswordCheckbox";

export interface STAFFLOGIN {
  email: string;
  password: string;
}

export default function StaffLoginForm() {
  const [formData, setFormData] = useState<STAFFLOGIN>({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const emailRef = useRef<HTMLInputElement>(null);

  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (data: STAFFLOGIN) =>
      postFormData("auth/airline-staff-login", data),

    onSuccess: async () => {
      toast.success("Logged In Successfully");

      await queryClient.invalidateQueries({
        queryKey: ["auth", "me"],
      });

      router.replace("/airline/dashboard");
    },

    onError: (error: Error) => {
      if (hasErrors(error)) {
        Object.values(error.errors).forEach((message) => {
          toast.error(String(message));
        });
      } else {
        toast.error(error.message || "Something went wrong");
      }
    },
  });

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    mutate(formData);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="staff-email"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Staff email
        </label>

        <input
          id="staff-email"
          type="email"
          ref={emailRef}
          autoComplete="username"
          value={formData.email}
          onChange={(event) =>
            setFormData({
              ...formData,
              email: event.target.value,
            })
          }
          placeholder="you@example.com"
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
        />
      </div>

      <div>
        <label
          htmlFor="staff-password"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Password
        </label>

        <input
          id="staff-password"
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          value={formData.password}
          onChange={(event) =>
            setFormData({
              ...formData,
              password: event.target.value,
            })
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
        {isPending ? "Logging in ..." : "Login as Staff"}
      </button>
    </form>
  );
}
