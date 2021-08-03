import { Static } from '@sinclair/typebox';
import { BearerToken, PostCreateBearerToken } from '../schemas/auth';

export type BearerTokenType = Static<typeof BearerToken>;

export type PostCreateBearerTokenType = Static<typeof PostCreateBearerToken>;
