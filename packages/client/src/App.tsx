import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query'
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import {APP_NAME} from '@shared/sharedConstants'
import {AuthPage} from './AuthPage'
import {GoogleCallback} from './GoogleCallback'

const HomePage = () => {
  const queryClient = useQueryClient()

  const {data: users, isLoading} = useQuery({
    queryKey: ['users'],
    queryFn: () => fetch('/api/users').then((res) => {
      if (res.status === 401) throw new Error('unauthorized')
      return res.json()
    }),
  })

  const logoutMutation = useMutation({
    mutationFn: () => fetch('/api/auth/logout', {method: 'POST'}),
    onSuccess: () => queryClient.invalidateQueries({queryKey: ['users']}),
  })

  if (isLoading) return <p>Loading...</p>

  return (
    <div style={{maxWidth: 600, margin: '40px auto'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <h1>{APP_NAME}</h1>
        <button onClick={() => logoutMutation.mutate()}>Logout</button>
      </div>
      <h2>Users</h2>
      <ul>
        {users?.map((user: {userId: string; email: string; name: string | null}) => (
          <li key={user.userId}>{user.email} {user.name && `(${user.name})`}</li>
        ))}
      </ul>
    </div>
  )
}

const ProtectedRoute = ({children}: {children: React.ReactNode}) => {
  const {data, isLoading, isError} = useQuery({
    queryKey: ['users'],
    queryFn: () => fetch('/api/users').then((res) => {
      if (res.status === 401) throw new Error('unauthorized')
      return res.json()
    }),
    retry: false,
  })

  if (isLoading) return <p>Loading...</p>
  if (isError || !data) return <Navigate to="/auth" replace />

  return <>{children}</>
}

export const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/auth/google/callback" element={<GoogleCallback />} />
      <Route path="*" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
    </Routes>
  </BrowserRouter>
)
