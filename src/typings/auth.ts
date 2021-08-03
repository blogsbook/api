import { Static } from '@sinclair/typebox';
import { AccessToken, BearerToken, PostCreateAccessToken, PostCreateBearerToken } from '../schemas/auth';

export type AccessTokenType = Static<typeof AccessToken>;

export type BearerTokenType = Static<typeof BearerToken>;

export type PostCreateAccessTokenType = Static<typeof PostCreateAccessToken>;

export type PostCreateBearerTokenType = Static<typeof PostCreateBearerToken>;
