import {useMutation} from '@tanstack/react-query'
import {useState} from 'react'
import {useNavigate} from 'react-router-dom'

export const AuthPage = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  const registerMutation = useMutation({
    mutationFn: () =>
      fetch('/api/auth/register', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email, password, name}),
      }).then(async (res) => {
        const data = await res.json()
        if (!res.ok) throw new Error(data.error)
        return data
      }),
    onSuccess: () => navigate('/'),
    onError: (err: Error) => setError(err.message),
  })

  const loginMutation = useMutation({
    mutationFn: () =>
      fetch('/api/auth/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email, password}),
      }).then(async (res) => {
        const data = await res.json()
        if (!res.ok) throw new Error(data.error)
        return data
      }),
    onSuccess: () => navigate('/'),
    onError: (err: Error) => setError(err.message),
  })

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
      <h1>Auth</h1>
      {error && <p style={{color: 'red'}}>{error}</p>}

      <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <div style={{display: 'flex', gap: 8}}>
          <button onClick={() => registerMutation.mutate()}>Register</button>
          <button onClick={() => loginMutation.mutate()}>Login</button>
        </div>

        <hr />

        <button onClick={handleGoogleLogin}>Login with Google</button>
      </div>
    </div>
  )
}
