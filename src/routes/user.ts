import { createHash } from 'crypto';
import { FastifyPluginCallback } from 'fastify';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { BadRequestError, ResourceNotFoundError, UnauthorizedRequestError } from '../schemas/error';
import {
  DeleteSingleUserByIdParams,
  GetMultipleUsersByIdsQuery,
  GetSingleUserByIdParams,
  NewUser,
  PrivateUser,
  PublicUser,
} from '../schemas/user';
import { BadRequestErrorType, ResourceNotFoundErrorType, UnauthorizedRequestErrorType } from '../typings/error';
import {
  DeleteSingleUserByIdParamsType,
  GetMultipleUsersByIdsQueryType,
  GetSingleUserByIdParamsType,
  NewUserType,
  PrivateUserType,
  PublicUserType,
} from '../typings/user';

const userRoutes: FastifyPluginCallback = async fastify => {
  /**
   * Create a new user
   */
  fastify.route<{ Body: NewUserType }>({
    method: 'POST',
    url: '/users',
    schema: {
      body: NewUser,
      response: {
        201: PrivateUser,
        400: BadRequestError,
      },
    },
    handler: async function (req, reply) {
      const { body } = req;
      const userAlreadyExists = await this.mongo.db
        ?.collection('users')
        .find({ $or: [{ username: body.username }, { email: body.email }] }, { projection: { _id: 0 } })
        .toArray();
      if (userAlreadyExists && userAlreadyExists.length > 0) {
        const errorResponse: BadRequestErrorType = {
          statusCode: 400,
          error: 'Bad Request',
          message: 'A user with provided username and/or email already exists',
        };
        return reply.status(400).send(errorResponse);
      }
      const createdUser: PrivateUserType = { ...body, id: uuidv4() };
      await this.mongo.db?.collection('users').insertOne(createdUser);
      reply.status(201).send(createdUser);
    },
  });

  /**
   * Get a single user by id
   */
  fastify.route<{ Params: GetSingleUserByIdParamsType }>({
    method: 'GET',
    url: '/users/:id',
    schema: {
      params: GetSingleUserByIdParams,
      response: {
        200: PublicUser,
        404: ResourceNotFoundError,
      },
    },
    handler: async function (req, reply) {
      const { id } = req.params;
      const user = await this.mongo.db?.collection('users').findOne<PublicUserType>({ id }, { projection: { _id: 0 } });
      if (typeof user === 'undefined') {
        const errorResponse: ResourceNotFoundErrorType = {
          statusCode: 404,
          error: 'ResourceNotFound',
          message: 'no user with the provided id exists',
        };
        return reply.status(404).send(errorResponse);
      }
      reply.send(user);
    },
  });

  /**
   * Get multiple users by ids
   */
  fastify.route<{ Querystring: GetMultipleUsersByIdsQueryType }>({
    method: 'GET',
    url: '/users',
    schema: {
      querystring: GetMultipleUsersByIdsQuery,
      response: {
        200: {
          type: 'array',
          items: PublicUser,
        },
        400: BadRequestError,
        404: ResourceNotFoundError,
      },
    },
    handler: async function (req, reply) {
      const { ids } = req.query;
      if (ids.length === 0) {
        const errorResponse: BadRequestErrorType = {
          statusCode: 400,
          error: 'Bad Request',
          message: 'No ids were provided in the querystring',
        };
        return reply.status(400).send(errorResponse);
      }
      const idsArray = ids.split(',');
      const users = await this.mongo.db
        ?.collection('users')
        .find<PublicUserType>({ id: { $in: idsArray } }, { projection: { _id: 0 } })
        .toArray();
      if (typeof users === 'undefined' || users.length === 0) {
        const errorResponse: ResourceNotFoundErrorType = {
          statusCode: 404,
          error: 'ResourceNotFound',
          message: 'No users with the provided ids exist',
        };
        return reply.status(404).send(errorResponse);
      }
      reply.send(users);
    },
  });

  /**
   * Delete a single user by id
   */
  fastify.route<{ Params: DeleteSingleUserByIdParamsType }>({
    method: 'DELETE',
    url: '/users/:id',
    schema: {
      params: DeleteSingleUserByIdParams,
      response: {
        401: UnauthorizedRequestError,
      },
    },
    handler: async function (req, reply) {
      const bearerToken = req.headers.authorization?.split(' ')[1];
      if (!bearerToken) {
        const errorResponse: UnauthorizedRequestErrorType = {
          statusCode: 401,
          error: 'Unauthorized Request',
          message: 'Please provide bearer token for authorization',
        };
        return reply.status(401).send(errorResponse);
      }
      const { id } = req.params;
      const user = await this.mongo.db
        ?.collection('users')
        .findOne<PrivateUserType>({ id }, { projection: { _id: 0 } });
      const secretKey = createHash('sha256').update(`${user?.username}${user?.password}`).digest('hex');
      const { userId } = jwt.verify(bearerToken, secretKey) as { userId: string };
      if (!userId || userId !== id) {
        const errorResponse: UnauthorizedRequestErrorType = {
          statusCode: 401,
          error: 'Unauthorized Request',
          message: 'The user is not authorized to delete the requested user',
        };
        return reply.status(401).send(errorResponse);
      }
      await this.mongo.db?.collection('users').deleteOne({ id });
      reply.status(204).send();
    },
  });
};

export default userRoutes;
