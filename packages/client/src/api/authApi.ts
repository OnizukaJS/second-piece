import type {AuthResponse} from '@shared/schemas/usersSchemas'

import {api} from './api'

export const authApi = {
  register: (data: {email: string; password: string; name?: string}) =>
    api.post<AuthResponse>('/api/auth/register', data),

  login: (data: {email: string; password: string}) =>
    api.post<AuthResponse>('/api/auth/login', data),

  loginWithGoogle: (code: string) =>
    api.post<AuthResponse>('/api/auth/login/google', {code}),

  logout: () => api.post<void>('/api/auth/logout'),
}
