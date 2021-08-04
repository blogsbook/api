import { Type } from '@sinclair/typebox';

export const PublicUser = Type.Object(
  {
    id: Type.String(),
    username: Type.String(),
  },
  { additionalProperties: false }
);

export const PrivateUser = Type.Object(
  {
    id: Type.String(),
    username: Type.String(),
    email: Type.String({ format: 'email' }),
    password: Type.String(),
  },
  { additionalProperties: false }
);

export const NewUser = Type.Omit(PrivateUser, ['id']);

export const GetSingleUserByIdParams = Type.Object({
  id: Type.String(),
});

export const GetMultipleUsersByIdsQuery = Type.Object({
  ids: Type.String(),
});

export const DeleteSingleUserByIdParams = Type.Object({
  id: Type.String(),
});
