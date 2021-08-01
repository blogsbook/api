import { Static, Type } from '@sinclair/typebox';

export const NewUser = Type.Object({
  username: Type.String(),
});
export type NewUserType = Static<typeof NewUser>;

export const User = Type.Object({
  id: Type.String(),
  username: Type.String(),
});
export type UserType = Static<typeof User>;

export const getSingleUserByIdParams = Type.Object({
  id: Type.String(),
});
export type getSingleUserByIdParamsType = Static<typeof getSingleUserByIdParams>;

export const getMultipleUsersByIdsQuery = Type.Object({
  ids: Type.String(),
});
export type getMultipleUsersByIdsQueryType = Static<typeof getMultipleUsersByIdsQuery>;

export const deleteSingleUserByIdParams = Type.Object({
  id: Type.String(),
});
export type deleteSingleUserByIdParamsType = Static<typeof deleteSingleUserByIdParams>;
