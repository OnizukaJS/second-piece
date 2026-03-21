import {useTranslation} from 'react-i18next'
import {DISPLAY_MODE, LANGUAGE} from '@shared/sharedConstants'
import type {UserDetails} from '@shared/schemas/usersSchemas'
import {useLogoutMutation} from './queries/authQueries'
import {useUpdateUserSettingsMutation} from './queries/usersQueries'
import i18n from './i18n'
import {LANGUAGE_NAME, THEME_LABEL_KEY} from './constants'
import {applyTheme} from './theme'
import {Button} from './components/Button'

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
    applyTheme(displayMode)
    if (currentUser) {
      updateSettings({displayMode})
    }
  }

  return (
    <header className="flex items-center justify-between bg-surface p-4 text-text">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <span className="text-sm text-text-muted">{t('common.language')}:</span>
          {Object.values(LANGUAGE).map((language) => (
            <Button 
              key={language}
              title={LANGUAGE_NAME[language]}
              onClick={() => handleLanguageChange(language)}
              variant={currentLanguage === language ? 'primary' : 'secondary'}
            />
          ))}
        </div>

        <div className="flex items-center gap-1">
          <span className="text-sm text-text-muted">{t('common.theme')}:</span>
          {Object.values(DISPLAY_MODE).map((mode) => (
            <Button 
              key={mode}
              title={t(THEME_LABEL_KEY[mode])}
              onClick={() => handleThemeChange(mode)}
              variant={currentTheme === mode ? 'primary' : 'secondary'}
            />
          ))}
        </div>
      </div>

      {currentUser && (
        <div className="flex items-center gap-3">
          {currentUser.avatarUrl ? (
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name ?? ''}
              className="h-8 w-8 rounded-full"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm text-white">
              {(currentUser.name?.[0] ?? currentUser.email[0]).toUpperCase()}
            </div>
          )}
          <Button 
            title={t('common.logout')}
            onClick={() => logoutMutation()}
          />
        </div>
      )}
    </header>
  )
}
