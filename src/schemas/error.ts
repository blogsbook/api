import { Type } from '@sinclair/typebox';

export const ResourceNotFoundError = Type.Object({
  error: Type.Object({
    values: Type.Array(Type.String()),
    message: Type.String(),
  }),
});

export const BadRequestError = Type.Object({
  error: Type.Object({
    message: Type.String(),
  }),
});
