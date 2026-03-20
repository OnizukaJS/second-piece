import {DISPLAY_MODE} from '@shared/sharedConstants'

export const applyTheme = (displayMode: string) => {
  if (displayMode === DISPLAY_MODE.DARK) {
    document.documentElement.classList.add('dark')
  } else if (displayMode === DISPLAY_MODE.LIGHT) {
    document.documentElement.classList.remove('dark')
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    document.documentElement.classList.toggle('dark', prefersDark)
  }
}
