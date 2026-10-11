const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function request<T>(
  route: string,
  options: RequestInit = {},
): Promise<T> {
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured");
  }

  const baseUrl = API_URL.replace(/\/+$/, "");
  const path = route.replace(/^\/+/, "");

  const response = await fetch(`${baseUrl}/${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include",
  });

  const text = await response.text();
  let data: unknown = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!response.ok) {
    const message =
      typeof data === "object" && data !== null && "message" in data
        ? (data as { message: string | string[] }).message
        : "Something went wrong";

    throw new Error(
      Array.isArray(message) ? message.join(", ") : String(message),
    );
  }

  return data as T;
}

// export const getData = <T = unknown>(route: string) =>
//   request<T>(route);

export const postData = <TBody, TResponse = unknown>(
  route: string,
  body: TBody,
) =>
  request<TResponse>(route, {
    method: "POST",
    body: JSON.stringify(body),
  });

export const patchData = <TBody, TResponse = unknown>(
  route: string,
  body: TBody,
) =>
  request<TResponse>(route, {
    method: "PATCH",
    body: JSON.stringify(body),
  });

export const deleteData = <TResponse = unknown>(route: string) =>
  request<TResponse>(route, {
    method: "DELETE",
  });
