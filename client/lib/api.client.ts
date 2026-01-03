const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

type FetchOptions = RequestInit & {
    params?: Record<string, string>;
};

export async function apiClient<T>(endpoint: string, { params, ...options }: FetchOptions = {}): Promise<T> {
    const url = new URL(`${BASE_URL}${endpoint}`);
    if (params) {
        Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, value));
    }

    const headers = new Headers(options.headers);

    if (!headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
    }

    const response = await fetch(url.toString(), {
        ...options,
        headers,
        credentials: "include",
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: "An error occurred" }));
        throw new Error(error.message || response.statusText);
    }

    return response.json();
}