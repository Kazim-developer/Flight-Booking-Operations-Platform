// "use client";

// import { useAuthStore } from "@/stores/auth.store";
// import { useRouter } from "next/navigation";
// import { useEffect } from "react";

// export default function ProtectedRoute({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
//   const authChecked = useAuthStore((s) => s.authChecked);
//   const hydrated = useAuthStore((s) => s.hydrated);

//   const router = useRouter();

//   useEffect(() => {
//     if (hydrated && authChecked && !isAuthenticated) {
//       router.push("/login");
//     }
//   }, [hydrated, authChecked, isAuthenticated, router]);

//   if (!hydrated || !authChecked) return null;

//   if (!isAuthenticated) return null;

//   return <>{children}</>;
// }
