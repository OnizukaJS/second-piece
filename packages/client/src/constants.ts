import {DISPLAY_MODE, DisplayMode, LANGUAGE, Language} from "@shared/sharedConstants";

export const LANGUAGE_NAME: Record<Language, string> = {
    [LANGUAGE.EN]: 'EN',
    [LANGUAGE.ES]: 'ES',
    [LANGUAGE.FR]: 'FR',
}

export const THEME_LABEL_KEY: Record<DisplayMode, string> = {
    [DISPLAY_MODE.LIGHT]: 'common.light',
    [DISPLAY_MODE.DARK]: 'common.dark',
    [DISPLAY_MODE.SYSTEM]: 'common.system',
}