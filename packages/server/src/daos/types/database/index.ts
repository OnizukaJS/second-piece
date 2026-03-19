// @generated
// Automatically generated. Don't change this file manually.

import Tokens, { TokensInitializer, TokensId } from './Tokens';
import TokensHistory, { TokensHistoryInitializer } from './TokensHistory';
import UserSettings, { UserSettingsInitializer, UserSettingsId } from './UserSettings';
import UserSettingsHistory, { UserSettingsHistoryInitializer } from './UserSettingsHistory';
import Users, { UsersInitializer, UsersId } from './Users';
import UsersHistory, { UsersHistoryInitializer } from './UsersHistory';
import DisplayMode from './DisplayMode';
import Language from './Language';
import TokenType from './TokenType';
import UserStatus from './UserStatus';

type Model =
  | Tokens
  | TokensHistory
  | UserSettings
  | UserSettingsHistory
  | Users
  | UsersHistory

interface ModelTypeMap {
  'tokens': Tokens;
  'tokensHistory': TokensHistory;
  'userSettings': UserSettings;
  'userSettingsHistory': UserSettingsHistory;
  'users': Users;
  'usersHistory': UsersHistory;
}

type ModelId =
  | TokensId
  | UserSettingsId
  | UsersId

interface ModelIdTypeMap {
  'tokens': TokensId;
  'userSettings': UserSettingsId;
  'users': UsersId;
}

type Initializer =
  | TokensInitializer
  | TokensHistoryInitializer
  | UserSettingsInitializer
  | UserSettingsHistoryInitializer
  | UsersInitializer
  | UsersHistoryInitializer

interface InitializerTypeMap {
  'tokens': TokensInitializer;
  'tokensHistory': TokensHistoryInitializer;
  'userSettings': UserSettingsInitializer;
  'userSettingsHistory': UserSettingsHistoryInitializer;
  'users': UsersInitializer;
  'usersHistory': UsersHistoryInitializer;
}

export type {
  Tokens, TokensInitializer, TokensId,
  TokensHistory, TokensHistoryInitializer,
  UserSettings, UserSettingsInitializer, UserSettingsId,
  UserSettingsHistory, UserSettingsHistoryInitializer,
  Users, UsersInitializer, UsersId,
  UsersHistory, UsersHistoryInitializer,
  DisplayMode,
  Language,
  TokenType,
  UserStatus,

  Model,
  ModelTypeMap,
  ModelId,
  ModelIdTypeMap,
  Initializer,
  InitializerTypeMap
};
