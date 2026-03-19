// @generated
// Automatically generated. Don't change this file manually.

import { UsersId } from './Users';
import Language from './Language';
import DisplayMode from './DisplayMode';

export type UserSettingsId = string & { " __flavor"?: 'userSettings' };

export default interface UserSettings {
  /** Primary key. Index: userSettings_pkey */
  userSettingsId: UserSettingsId;

  /** Index: usersettings_userid_unique */
  userId: UsersId;

  language: Language;

  displayMode: DisplayMode;

  createdAt: Date;

  updatedAt: Date;
}

export interface UserSettingsInitializer {
  /**
   * Default value: gen_random_uuid()
   * Primary key. Index: userSettings_pkey
   */
  userSettingsId?: UserSettingsId;

  /** Index: usersettings_userid_unique */
  userId: UsersId;

  /** Default value: 'es'::language */
  language?: Language;

  /** Default value: 'system'::display_mode */
  displayMode?: DisplayMode;

  /** Default value: CURRENT_TIMESTAMP */
  createdAt?: Date;

  /** Default value: CURRENT_TIMESTAMP */
  updatedAt?: Date;
}
