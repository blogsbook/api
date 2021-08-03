import { Type } from '@sinclair/typebox';

export const AccessToken = Type.Object({
  userId: Type.String(),
  token: Type.String(),
  type: Type.String(),
});

export const BearerToken = Type.Object({
  token: Type.String(),
  type: Type.String(),
});

export const PostCreateAccessToken = Type.Object({
  username: Type.String(),
  password: Type.String(),
});

export const PostCreateBearerToken = Type.Object({
  username: Type.String(),
  accessToken: Type.String(),
});
