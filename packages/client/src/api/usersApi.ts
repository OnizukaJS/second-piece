import type {User, UserDetails, UserSettings} from '@shared/schemas/usersSchemas'

import {api} from './api'

export const usersApi = {
  me: () => api.get<UserDetails>('/api/users/me'),

  updateMySettings: (data: {language?: string; displayMode?: string}) =>
    api.put('/api/users/me/settings', data),

  getUsers: () => api.get<User[]>('/api/users'),

  getUserById: (userId: string) => api.get<User>(`/api/users/${userId}`),
}
