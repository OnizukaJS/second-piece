// @generated
// Automatically generated. Don't change this file manually.

import UserStatus from './UserStatus';

export type UsersId = string & { " __flavor"?: 'users' };

export default interface Users {
  /** Primary key. Index: users_pkey */
  userId: UsersId;

  name: string | null;

  /** Index: users_email_unique */
  email: string;

  password: string | null;

  createdAt: Date;

  updatedAt: Date;

  status: UserStatus;

  phoneNumber: string | null;

  avatarUrl: string | null;

  firstName: string | null;

  lastName: string | null;

  dateOfBirth: Date | null;
}

export interface UsersInitializer {
  /**
   * Default value: gen_random_uuid()
   * Primary key. Index: users_pkey
   */
  userId?: UsersId;

  name?: string | null;

  /** Index: users_email_unique */
  email: string;

  password?: string | null;

  /** Default value: CURRENT_TIMESTAMP */
  createdAt?: Date;

  /** Default value: CURRENT_TIMESTAMP */
  updatedAt?: Date;

  status: UserStatus;

  phoneNumber?: string | null;

  avatarUrl?: string | null;

  firstName?: string | null;

  lastName?: string | null;

  dateOfBirth?: Date | null;
}
