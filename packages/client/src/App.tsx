import {useTranslation} from 'react-i18next'
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import {APP_NAME} from '@shared/sharedConstants'
import {useLogoutMutation} from './queries/authQueries'
import {useGetUsersQuery} from './queries/usersQueries'
import {AuthPage} from './AuthPage'
import {GoogleCallback} from './GoogleCallback'
import i18n from './i18n'

const HomePage = () => {
  const {t} = useTranslation()
  const {data: users, isLoading} = useGetUsersQuery()
  const {mutate: logoutMutation} = useLogoutMutation()

  if (isLoading) return <p>{t('common.loading')}</p>

  return (
    <div style={{maxWidth: 600, margin: '40px auto'}}>
      <div className="flex gap-1">
        <button onClick={() => i18n.changeLanguage('en')}>EN</button>
        <button onClick={() => i18n.changeLanguage('fr')}>FR</button>
        <button onClick={() => i18n.changeLanguage('es')}>ES</button>
      </div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <h1>{APP_NAME}</h1>
        <button onClick={() => logoutMutation()}>{t('common.logout')}</button>
      </div>
      <h2>{t('home.users')}</h2>
      <ul>
        {users?.map((user) => (
          <li key={user.userId}>{user.email} {user.name && `(${user.name})`}</li>
        ))}
      </ul>
    </div>
  )
}

const ProtectedRoute = ({children}: {children: React.ReactNode}) => {
  const {t} = useTranslation()
  const {data, isLoading, isError} = useGetUsersQuery()

  if (isLoading) return <p>{t('common.loading')}</p>
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
