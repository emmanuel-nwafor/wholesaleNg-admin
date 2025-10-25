export interface FetchWithTokenOptions extends RequestInit {
  headers?: Record<string, string>;
}

export async function fetchWithToken<T = unknown>(
  endpoint: string,
  options: FetchWithTokenOptions = {}
): Promise<T> {
  const token =
    (typeof window !== "undefined" ? localStorage.getItem("token") : null) ||
    process.env.NEXT_PUBLIC_DEV_TOKEN;

  const BASE_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL ??
    "https://wholesalenaija-backend-production.up.railway.app/api";

  const isFormData = options.body instanceof FormData;

  const headers: Record<string, string> = {};
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  Object.assign(headers, options.headers);

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Request failed: ${res.status} - ${errorText}`);
    }

    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return (await res.json()) as T;
    }

    return (await res.text()) as T;
  } catch (error) {
    console.error("Fetch with token error:", error);
    throw error instanceof Error ? error : new Error("Unknown error occurred");
  }
}