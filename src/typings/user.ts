import { Static } from '@sinclair/typebox';
import {
  deleteSingleUserByIdParams,
  getMultipleUsersByIdsQuery,
  getSingleUserByIdParams,
  NewUser,
  User,
} from '../schemas/user';

export type UserType = Static<typeof User>;

export type NewUserType = Static<typeof NewUser>;

export type getSingleUserByIdParamsType = Static<typeof getSingleUserByIdParams>;

export type getMultipleUsersByIdsQueryType = Static<typeof getMultipleUsersByIdsQuery>;

export type deleteSingleUserByIdParamsType = Static<typeof deleteSingleUserByIdParams>;
