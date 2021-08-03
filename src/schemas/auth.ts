import { Type } from '@sinclair/typebox';

export const BearerToken = Type.Object({
  token: Type.String(),
  type: Type.String(),
});

export const PostCreateBearerToken = Type.Object({
  username: Type.String(),
  password: Type.String(),
});
