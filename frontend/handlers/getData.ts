export const getData = async (route: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${route}`, {
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    throw data;
  }

  return data;
};
