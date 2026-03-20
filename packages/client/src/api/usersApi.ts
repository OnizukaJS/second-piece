import type {User} from '@shared/schemas/usersSchemas'

import {api} from './api'

export const usersApi = {
  me: () => api.get<User>('/api/users/me'),

  getUsers: () => api.get<User[]>('/api/users'),

  getUserById: (userId: string) => api.get<User>(`/api/users/${userId}`),
}
