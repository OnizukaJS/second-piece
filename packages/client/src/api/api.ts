import { HTTP_STATUS } from "@shared/sharedConstants"

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
  }
}

const request = async <T>(url: string, options?: RequestInit): Promise<T> => {
  const res = await fetch(url, {
    headers: {'Content-Type': 'application/json'},
    ...options,
  })

  if (res.status === HTTP_STATUS.NO_CONTENT) return undefined as T

  const data = await res.json()

  if (!res.ok) {
    throw new ApiError(res.status, data.error || 'Something went wrong')
  }

  return data as T
}

export const api = {
  get: <T>(url: string) => request<T>(url),
  post: <T>(url: string, body?: unknown) => request<T>(url, {method: 'POST', body: body ? JSON.stringify(body) : undefined}),
  put: <T>(url: string, body: unknown) => request<T>(url, {method: 'PUT', body: JSON.stringify(body)}),
  delete: <T>(url: string) => request<T>(url, {method: 'DELETE'}),
}
