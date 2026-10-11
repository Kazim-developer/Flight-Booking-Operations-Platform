"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAuthStore } from "@/store/auth.store";
import { deleteData, patchData, postData } from "@/utils/apiMethods";
import { getData } from "@/handlers/getData";

interface Staff {
  id: string;
  email: string;
  fullName: string;
  role: "STAFF";
  createdAt: string;
  updatedAt?: string;
}

interface StaffFormValues {
  email: string;
  fullName: string;
  password: string;
}

const EMPTY_FORM: StaffFormValues = {
  email: "",
  fullName: "",
  password: "",
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

export default function AirlineStaffPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const user = useAuthStore((state) => state.user);
  const isLoadingAuth = useAuthStore((state) => state.isLoading);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [form, setForm] = useState<StaffFormValues>(EMPTY_FORM);
  const [formError, setFormError] = useState("");

  const isAdmin =
    isAuthenticated &&
    user?.userType === "AIRLINE_USER" &&
    user.role === "ADMIN";

  useEffect(() => {
    if (!isLoadingAuth && !isAdmin) {
      router.replace("/");
    }
  }, [isLoadingAuth, isAdmin, router]);

  const staffQuery = useQuery({
    queryKey: ["airline-staff"],
    queryFn: () => getData("airline-staff"),
    enabled: !isLoadingAuth && isAdmin,
  });

  const saveMutation = useMutation({
    mutationFn: async (values: StaffFormValues) => {
      const body: {
        email: string;
        fullName: string;
        password?: string;
      } = {
        email: values.email.trim(),
        fullName: values.fullName.trim(),
      };

      if (values.password.trim()) {
        body.password = values.password;
      }

      if (editingStaff) {
        return patchData(`airline-staff/${editingStaff.id}`, body);
      }

      return postData("airline-staff", {
        ...body,
        password: values.password,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["airline-staff"],
      });

      closeModal();
    },
    onError: (error: Error) => {
      setFormError(error.message || "Unable to save staff member.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (staffId: string) => deleteData(`airline-staff/${staffId}`),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["airline-staff"],
      });
    },
  });

  function openCreateModal() {
    setEditingStaff(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setModalOpen(true);
  }

  function openEditModal(staff: Staff) {
    setEditingStaff(staff);
    setForm({
      email: staff.email,
      fullName: staff.fullName,
      password: "",
    });
    setFormError("");
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingStaff(null);
    setForm(EMPTY_FORM);
    setFormError("");
    saveMutation.reset();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");

    if (!form.fullName.trim() || !form.email.trim()) {
      setFormError("Name and email are required.");
      return;
    }

    if (!editingStaff && form.password.length < 8) {
      setFormError("Password must be at least 8 characters.");
      return;
    }

    if (form.password && form.password.length < 8) {
      setFormError("Password must be at least 8 characters.");
      return;
    }

    saveMutation.mutate(form);
  }

  function handleDelete(staff: Staff) {
    const confirmed = window.confirm(
      `Delete ${staff.fullName} (${staff.email})? This action cannot be undone.`,
    );

    if (confirmed) {
      deleteMutation.mutate(staff.id);
    }
  }

  if (isLoadingAuth || !isAdmin) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 text-sm text-gray-500">
        Loading your airline workspace...
      </main>
    );
  }

  const staffMembers = staffQuery.data ?? [];

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-medium text-blue-700">
              Airline administration
            </p>
            <h1 className="text-3xl font-bold tracking-tight">
              Staff management
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Create and manage accounts for your airline staff.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="rounded-lg bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
          >
            + Add staff member
          </button>
        </header>

        <section className="mb-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <p className="text-sm text-gray-500">Total staff members</p>
            <p className="mt-2 text-3xl font-bold">
              {staffQuery.isSuccess ? staffMembers.length : "—"}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <p className="text-sm text-gray-500">Account type</p>
            <p className="mt-2 text-xl font-semibold">Airline staff</p>
            <p className="mt-1 text-sm text-gray-500">
              Managed by your administrator account
            </p>
          </div>
        </section>

        <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="flex flex-col gap-1 border-b border-gray-200 px-5 py-4 sm:px-6">
            <h2 className="font-semibold">All staff members</h2>
            <p className="text-sm text-gray-500">
              Only staff associated with your airline are shown.
            </p>
          </div>

          {staffQuery.isPending ? (
            <div className="px-6 py-16 text-center text-sm text-gray-500">
              Loading staff members...
            </div>
          ) : staffQuery.isError ? (
            <div className="px-6 py-12 text-center">
              <p className="font-medium text-red-600">
                {staffQuery.error.message || "Failed to load staff members."}
              </p>
              <button
                type="button"
                onClick={() => staffQuery.refetch()}
                className="mt-4 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50"
              >
                Try again
              </button>
            </div>
          ) : staffMembers.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-xl">
                +
              </div>
              <h3 className="mt-4 font-semibold">No staff members yet</h3>
              <p className="mt-2 text-sm text-gray-500">
                Add your first staff member to get started.
              </p>
              <button
                type="button"
                onClick={openCreateModal}
                className="mt-5 rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800"
              >
                Add staff member
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px] text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-6 py-4 font-medium">Staff member</th>
                    <th className="px-6 py-4 font-medium">Role</th>
                    <th className="px-6 py-4 font-medium">Date added</th>
                    <th className="px-6 py-4 text-right font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {staffMembers.map((staff: any) => (
                    <tr key={staff.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-800">
                            {staff.fullName.trim().charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium">{staff.fullName}</p>
                            <p className="mt-1 text-gray-500">{staff.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                          {staff.role}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-gray-500">
                        {formatDate(staff.createdAt)}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-3">
                          <button
                            type="button"
                            onClick={() => openEditModal(staff)}
                            className="font-medium text-blue-700 hover:text-blue-900"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            disabled={deleteMutation.isPending}
                            onClick={() => handleDelete(staff)}
                            className="font-medium text-red-600 hover:text-red-800 disabled:opacity-50"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {deleteMutation.isError && (
            <p className="border-t border-red-100 bg-red-50 px-6 py-3 text-sm text-red-700">
              {deleteMutation.error.message ||
                "Unable to delete this staff member."}
            </p>
          )}
        </section>
      </div>

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="staff-modal-title"
            className="my-auto w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl sm:p-8"
          >
            <div className="mb-6">
              <h2 id="staff-modal-title" className="text-xl font-bold">
                {editingStaff ? "Edit staff member" : "Add staff member"}
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                {editingStaff
                  ? "Update the account details. Leave the password blank to keep the existing password."
                  : "Create login credentials for a new airline staff member."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="staff-full-name"
                  className="mb-2 block text-sm font-medium"
                >
                  Full name
                </label>
                <input
                  id="staff-full-name"
                  type="text"
                  autoComplete="name"
                  required
                  maxLength={100}
                  value={form.fullName}
                  onChange={(event) =>
                    setForm({ ...form, fullName: event.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <label
                  htmlFor="staff-email"
                  className="mb-2 block text-sm font-medium"
                >
                  Email address
                </label>
                <input
                  id="staff-email"
                  type="email"
                  autoComplete="email"
                  required
                  maxLength={254}
                  value={form.email}
                  onChange={(event) =>
                    setForm({ ...form, email: event.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  placeholder="staff@airline.com"
                />
              </div>

              <div>
                <label
                  htmlFor="staff-password"
                  className="mb-2 block text-sm font-medium"
                >
                  Password {editingStaff && "(optional)"}
                </label>
                <input
                  id="staff-password"
                  type="password"
                  autoComplete="new-password"
                  required={!editingStaff}
                  minLength={8}
                  maxLength={72}
                  value={form.password}
                  onChange={(event) =>
                    setForm({ ...form, password: event.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  placeholder={
                    editingStaff
                      ? "Leave blank to keep current password"
                      : "At least 8 characters"
                  }
                />
              </div>

              {formError && (
                <p role="alert" className="text-sm text-red-600">
                  {formError}
                </p>
              )}

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saveMutation.isPending}
                  className="rounded-lg border border-gray-300 px-5 py-3 text-sm font-semibold hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saveMutation.isPending}
                  className="rounded-lg bg-blue-700 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saveMutation.isPending
                    ? "Saving..."
                    : editingStaff
                      ? "Save changes"
                      : "Create staff member"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}
