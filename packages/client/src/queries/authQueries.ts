import {useMutation, useQueryClient} from '@tanstack/react-query'
import {useNavigate} from 'react-router-dom'

import {authApi} from '../api/authApi'
import {usersQueryKeys} from './usersQueries'

export const useRegisterMutation = (onError: (message: string) => void) => {
  const navigate = useNavigate()
  return useMutation({
    mutationFn: async (data: {
      email: string;
      password: string;
      name?: string | undefined;
    }) => {
      await authApi.register(data)
    },
    onSuccess: () => navigate('/'),
    onError: (err: Error) => onError(err.message),
  })
}

export const useLoginMutation = (onError: (message: string) => void) => {
  const navigate = useNavigate()
  return useMutation({
    mutationFn: async (data: {
      email: string;
      password: string;
    }) => {
      await authApi.login(data)
    },
    onSuccess: () => navigate('/'),
    onError: (err: Error) => onError(err.message),
  })
}

export const useGoogleLoginMutation = () => {
  const navigate = useNavigate()
  return useMutation({
    mutationFn: async (code: string) => {
      await authApi.loginWithGoogle(code)
    },
    onSuccess: () => navigate('/'),
    onError: () => navigate('/auth'),
  })
}

export const useLogoutMutation = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  return useMutation({
    mutationFn: async () => {
      await authApi.logout()
    },
    onSuccess: () => {
      queryClient.removeQueries({queryKey: usersQueryKeys.me()})
      queryClient.removeQueries({queryKey: usersQueryKeys.getUsers()})
      navigate('/auth')
    },
  })
}
