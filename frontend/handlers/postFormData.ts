import { AIRLINEFORM } from "@/app/auth/components/AirlineForm";
import { AIRLINELOGIN } from "@/app/auth/components/AirlineLoginForm";
import { TRAVELERFORM } from "@/app/auth/components/TravelerForm";
import { TRAVELERLOGIN } from "@/app/auth/components/TravelerLoginForm";

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
