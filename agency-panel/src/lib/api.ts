const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export const api = {
  baseUrl: API_URL,

  async request<T>(
    endpoint: string,
    options: RequestInit & { token?: string } = {}
  ): Promise<T> {
    const { token, ...init } = options;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(init.headers as Record<string, string>),
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_URL}${endpoint}`, { ...init, headers });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
  },

  get: <T>(endpoint: string, token?: string) =>
    api.request<T>(endpoint, { method: 'GET', token }),

  post: <T>(endpoint: string, body?: unknown, token?: string) =>
    api.request<T>(endpoint, { method: 'POST', body: JSON.stringify(body), token }),
};
