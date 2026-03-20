import {useEffect, useRef} from 'react'
import {useTranslation} from 'react-i18next'
import {useSearchParams} from 'react-router-dom'
import {useGoogleLoginMutation} from './queries/authQueries'

export const GoogleCallback = () => {
  const {t} = useTranslation()
  const [searchParams] = useSearchParams()
  const called = useRef(false)
  const {mutate: googleLoginMutation} = useGoogleLoginMutation()

  useEffect(() => {
    const code = searchParams.get('code')
    if (code && !called.current) {
      called.current = true
      googleLoginMutation(code)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return <p>{t('auth.loggingInWithGoogle')}</p>
}
