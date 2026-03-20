import {useTranslation} from 'react-i18next'
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import {APP_NAME} from '@shared/sharedConstants'
import {useGetCurrentUser, useGetUsersQuery} from './queries/usersQueries'
import {AuthPage} from './AuthPage'
import {GoogleCallback} from './GoogleCallback'
import {Header} from './Header'

const HomePage = () => {
  const {t} = useTranslation()
  const {data: currentUser} = useGetCurrentUser()
  const {data: users, isLoading} = useGetUsersQuery()

  if (isLoading) return <p>{t('common.loading')}</p>

  return (
    <div style={{maxWidth: 600, margin: '0 auto'}}>
      <h1>{APP_NAME}</h1>

      <h2>{t('home.userDetails')}</h2>
      {currentUser && (
        <ul>
          <li>{t('auth.email')}: {currentUser.email}</li>
          <li>{t('auth.name')}: {currentUser.name ?? '-'}</li>
          <li>{t('home.firstName')}: {currentUser.firstName ?? '-'}</li>
          <li>{t('home.lastName')}: {currentUser.lastName ?? '-'}</li>
        </ul>
      )}

      <h2>{t('home.users')}</h2>
      <ul>
        {users?.map((user) => (
          <li key={user.userId}>- {user.email} {user.name && `(${user.name})`}</li>
        ))}
      </ul>
    </div>
  )
}

const ProtectedRoute = ({children}: {children: React.ReactNode}) => {
  const {t} = useTranslation()
  const {data, isLoading, isError} = useGetCurrentUser()

  if (isLoading) return <p>{t('common.loading')}</p>
  if (isError || !data) return <Navigate to="/auth" replace />

  return (
    <>
      <Header currentUser={data} />
      {children}
    </>
  )
}

const PublicRoute = ({children}: {children: React.ReactNode}) => (
  <>
    <Header />
    {children}
  </>
)

export const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/auth" element={<PublicRoute><AuthPage /></PublicRoute>} />
      <Route path="/auth/google/callback" element={<GoogleCallback />} />
      <Route path="*" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
    </Routes>
  </BrowserRouter>
)
