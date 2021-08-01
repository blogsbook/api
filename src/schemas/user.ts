import { Type } from '@sinclair/typebox';

export const User = Type.Object({
  id: Type.String(),
  username: Type.String(),
  email: Type.String({ format: 'email' }),
  password: Type.String(),
});

export const NewUser = Type.Omit(User, ['id']);

export const GetSingleUserByIdParams = Type.Object({
  id: Type.String(),
});

export const GetMultipleUsersByIdsQuery = Type.Object({
  ids: Type.String(),
});

export const DeleteSingleUserByIdParams = Type.Object({
  id: Type.String(),
});
