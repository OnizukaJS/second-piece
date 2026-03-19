// @generated
// Automatically generated. Don't change this file manually.

import { UsersId } from './Users';
import TokenType from './TokenType';

export type TokensId = string & { " __flavor"?: 'tokens' };

export default interface Tokens {
  /** Primary key. Index: tokens_pkey */
  tokenId: TokensId;

  userId: UsersId;

  /** Index: tokens_token_unique */
  token: string;

  type: TokenType;

  expireAt: Date;

  createdAt: Date;

  updatedAt: Date;
}

export interface TokensInitializer {
  /**
   * Default value: gen_random_uuid()
   * Primary key. Index: tokens_pkey
   */
  tokenId?: TokensId;

  userId: UsersId;

  /** Index: tokens_token_unique */
  token: string;

  type: TokenType;

  expireAt: Date;

  /** Default value: CURRENT_TIMESTAMP */
  createdAt?: Date;

  /** Default value: CURRENT_TIMESTAMP */
  updatedAt?: Date;
}
