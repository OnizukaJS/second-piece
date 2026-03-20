import {useQuery} from '@tanstack/react-query'

import {usersApi} from '../api/usersApi'

export const usersQueryKeys = {
  me: () => ['users', 'me'],
  getUsers: () => ['users'],
  getUserById: (userId: string) => ['users', userId],
}

export const useGetCurrentUser = () =>
  useQuery({
    queryKey: usersQueryKeys.me(),
    queryFn: async () => {
      const res = await usersApi.me()
      return res
    },
    retry: false,
  })

export const useGetUsersQuery = () =>
  useQuery({
    queryKey: usersQueryKeys.getUsers(),
    queryFn: async () => {
      const res = await usersApi.getUsers()
      return res
    },
    retry: false,
  })

export const useGetUserQuery = (userId: string) =>
  useQuery({
    queryKey: usersQueryKeys.getUserById(userId),
    queryFn: async () => {
      const res =  usersApi.getUserById(userId)
      return res
    },
    retry: false
  })