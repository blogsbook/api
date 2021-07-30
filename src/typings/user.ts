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

export const getUserParams = Type.Object({
  id: Type.String(),
});
export type getUserParamsType = Static<typeof getUserParams>;
