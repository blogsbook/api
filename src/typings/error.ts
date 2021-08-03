import { Static } from '@sinclair/typebox';
import { BadRequestError, ResourceNotFoundError, UnauthorizedRequestError } from '../schemas/error';

export type ResourceNotFoundErrorType = Static<typeof ResourceNotFoundError>;

export type BadRequestErrorType = Static<typeof BadRequestError>;

export type UnauthorizedRequestErrorType = Static<typeof UnauthorizedRequestError>;
