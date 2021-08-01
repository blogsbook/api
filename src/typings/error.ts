import { Static } from '@sinclair/typebox';
import { BadRequestError, ResourceNotFoundError } from '../schemas/error';

export type ResourceNotFoundErrorType = Static<typeof ResourceNotFoundError>;

export type BadRequestErrorType = Static<typeof BadRequestError>;
