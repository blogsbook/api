import { Type } from '@sinclair/typebox';

export const User = Type.Object({
  id: Type.String(),
  username: Type.String(),
  email: Type.String({ format: 'email' }),
  password: Type.String(),
});

export const NewUser = Type.Omit(User, ['id']);

export const getSingleUserByIdParams = Type.Object({
  id: Type.String(),
});

export const getMultipleUsersByIdsQuery = Type.Object({
  ids: Type.String(),
});

export const deleteSingleUserByIdParams = Type.Object({
  id: Type.String(),
});
