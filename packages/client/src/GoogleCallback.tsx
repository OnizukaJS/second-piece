import {useMutation} from '@tanstack/react-query'
import {useEffect, useRef} from 'react'
import {useTranslation} from 'react-i18next'
import {useNavigate, useSearchParams} from 'react-router-dom'

export const GoogleCallback = () => {
  const {t} = useTranslation()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const called = useRef(false)

  const mutation = useMutation({
    mutationFn: (code: string) =>
      fetch('/api/auth/login/google', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({code}),
      }).then(async (res) => {
        const data = await res.json()
        if (!res.ok) throw new Error(data.error)
        return data
      }),
    onSuccess: () => navigate('/'),
    onError: () => navigate('/auth'),
  })

  useEffect(() => {
    const code = searchParams.get('code')
    if (code && !called.current) {
      called.current = true
      mutation.mutate(code)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return <p>{t('auth.loggingInWithGoogle')}</p>
}
