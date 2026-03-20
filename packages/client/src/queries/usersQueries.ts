import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {useEffect} from 'react'

import i18n from '../i18n'
import {usersApi} from '../api/usersApi'

export const usersQueryKeys = {
  me: () => ['users', 'me'],
  getUsers: () => ['users'],
  getUserById: (userId: string) => ['users', userId],
}

export const useGetCurrentUser = () => {
  const query = useQuery({
    queryKey: usersQueryKeys.me(),
    queryFn: async () => {
      const res = await usersApi.me()
      return res
    },
    retry: false,
  })

  useEffect(() => {
    if (query.data?.userSettings.language) {
      i18n.changeLanguage(query.data.userSettings.language)
    }
  }, [query.data?.userSettings.language])

  return query
}

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
      const res = await usersApi.getUserById(userId)
      return res
    },
    retry: false,
  })

export const useUpdateUserSettingsMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: {language?: string; displayMode?: string}) => {
      await usersApi.updateMySettings(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: usersQueryKeys.me()})
    },
  })
}