import { Static } from '@sinclair/typebox';
import {
  DeleteSingleUserByIdParams,
  GetMultipleUsersByIdsQuery,
  GetSingleUserByIdParams,
  NewUser,
  User,
} from '../schemas/user';

export type UserType = Static<typeof User>;

export type NewUserType = Static<typeof NewUser>;

export type GetSingleUserByIdParamsType = Static<typeof GetSingleUserByIdParams>;

export type GetMultipleUsersByIdsQueryType = Static<typeof GetMultipleUsersByIdsQuery>;

export type DeleteSingleUserByIdParamsType = Static<typeof DeleteSingleUserByIdParams>;
