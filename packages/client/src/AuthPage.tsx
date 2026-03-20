import {useState} from 'react'
import {useTranslation} from 'react-i18next'
import {useRegisterMutation, useLoginMutation} from './queries/authQueries'

export const AuthPage = () => {
  const {t} = useTranslation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  const {mutate: registerMutation} = useRegisterMutation(setError)
  const {mutate: loginMutation} = useLoginMutation(setError)

  const handleGoogleLogin = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
    const redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'openid email profile',
    })
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params}`
  }

  return (
    <div style={{maxWidth: 400, margin: '100px auto'}}>
      <h1>{t('auth.title')}</h1>
      {error && <p style={{color: 'red'}}>{error}</p>}

      <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
        <input placeholder={t('auth.name')} value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder={t('auth.email')} value={email} onChange={(e) => setEmail(e.target.value)} />
        <input placeholder={t('auth.password')} type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <div style={{display: 'flex', gap: 8}}>
          <button onClick={() => registerMutation({email, password, name})}>{t('auth.register')}</button>
          <button onClick={() => loginMutation({email, password})}>{t('auth.login')}</button>
        </div>

        <hr />

        <button onClick={handleGoogleLogin}>{t('auth.loginWithGoogle')}</button>
      </div>
    </div>
  )
}
