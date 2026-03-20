import {useTranslation} from 'react-i18next'
import {DISPLAY_MODE, LANGUAGE} from '@shared/sharedConstants'
import type {UserDetails} from '@shared/schemas/usersSchemas'
import {useLogoutMutation} from './queries/authQueries'
import {useUpdateUserSettingsMutation} from './queries/usersQueries'
import i18n from './i18n'
import { LANGUAGE_NAME, THEME_LABEL_KEY } from './constants'

export const Header = ({currentUser}: {currentUser?: UserDetails}) => {
  const {t} = useTranslation()
  const {mutate: logoutMutation} = useLogoutMutation()
  const {mutate: updateSettings} = useUpdateUserSettingsMutation()

  const currentLanguage = currentUser?.userSettings.language ?? i18n.language
  const currentTheme = currentUser?.userSettings.displayMode ?? DISPLAY_MODE.SYSTEM

  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language)
    if (currentUser) {
      updateSettings({language})
    }
  }

  const handleThemeChange = (displayMode: string) => {
    if (currentUser) {
      updateSettings({displayMode})
    }
  }

  return (
    <header className="flex items-center justify-between p-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <span className="text-sm">{t('common.language')}:</span>
          {Object.values(LANGUAGE).map((language) => (
            <button
              key={language}
              onClick={() => handleLanguageChange(language)}
              className={`px-2 py-1 text-sm ${currentLanguage === language ? 'bg-red-500 text-white' : 'bg-white text-black'}`}
            >
              {LANGUAGE_NAME[language]}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <span className="text-sm">{t('common.theme')}:</span>
          {Object.values(DISPLAY_MODE).map((mode) => (
            <button
              key={mode}
              onClick={() => handleThemeChange(mode)}
              className={`px-2 py-1 text-sm ${currentTheme === mode ? 'bg-red-500 text-white' : 'bg-white text-black'}`}
            >
              {t(THEME_LABEL_KEY[mode])}
            </button>
          ))}
        </div>
      </div>

      {currentUser && (
        <button onClick={() => logoutMutation()} className="px-3 py-1 text-sm">
          {t('common.logout')}
        </button>
      )}
    </header>
  )
}
