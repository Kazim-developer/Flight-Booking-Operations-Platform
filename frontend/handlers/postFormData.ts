import { AIRLINEFORM } from "@/components/auth/AirlineSignupForm";
import { AIRLINELOGIN } from "@/components/AirlineLoginForm";
import { TRAVELERFORM } from "@/components/TravelerSignupForm";
import { TRAVELERLOGIN } from "@/components/auth/TravelerLoginForm";

export const postFormData = async (
  route: string,
  formData: TRAVELERFORM | AIRLINEFORM | TRAVELERLOGIN | AIRLINELOGIN,
) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${route}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    throw data;
  }

  return data;
};
