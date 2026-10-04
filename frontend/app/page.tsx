import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function Home() {
  return (
    <ProtectedRoute>
      <h1>Hello world</h1>;
    </ProtectedRoute>
  );
}
