import { Static } from '@sinclair/typebox';
import {
  DeleteSingleUserByIdParams,
  GetMultipleUsersByIdsQuery,
  GetSingleUserByIdParams,
  NewUser,
  PrivateUser,
  PublicUser,
} from '../schemas/user';

export type PublicUserType = Static<typeof PublicUser>;

export type PrivateUserType = Static<typeof PrivateUser>;

export type NewUserType = Static<typeof NewUser>;

export type GetSingleUserByIdParamsType = Static<typeof GetSingleUserByIdParams>;

export type GetMultipleUsersByIdsQueryType = Static<typeof GetMultipleUsersByIdsQuery>;

export type DeleteSingleUserByIdParamsType = Static<typeof DeleteSingleUserByIdParams>;
