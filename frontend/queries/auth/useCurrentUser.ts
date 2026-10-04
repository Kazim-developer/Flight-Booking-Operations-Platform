import { useQuery } from "@tanstack/react-query";

import type { AuthUser } from "@/store/auth.store";

export function useCurrentUser() {
  return useQuery<AuthUser>({
    queryKey: ["auth", "me"],

    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      if (!response.ok) {
        throw new Error("Not authenticated");
      }

      return response.json();
    },

    retry: false,
  });
}
