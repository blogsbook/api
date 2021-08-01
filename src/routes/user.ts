import { FastifyPluginCallback } from 'fastify';
import { v4 as uuidv4 } from 'uuid';
import { BadRequestError, ResourceNotFoundError } from '../schemas/error';
import {
  DeleteSingleUserByIdParams,
  GetMultipleUsersByIdsQuery,
  GetSingleUserByIdParams,
  NewUser,
  User,
} from '../schemas/user';
import { BadRequestErrorType, ResourceNotFoundErrorType } from '../typings/error';
import {
  DeleteSingleUserByIdParamsType,
  GetMultipleUsersByIdsQueryType,
  GetSingleUserByIdParamsType,
  NewUserType,
  UserType,
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
        201: User,
      },
    },
    handler: async function (req, reply) {
      const { body } = req;
      const createdUser: UserType = { ...body, id: uuidv4() };
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
        200: User,
        404: ResourceNotFoundError,
      },
    },
    handler: async function (req, reply) {
      const { id } = req.params;
      const user = await this.mongo.db?.collection('users').findOne<UserType>({ id }, { projection: { _id: 0 } });
      if (typeof user === 'undefined') {
        const errorResponse: ResourceNotFoundErrorType = {
          error: {
            values: [id],
            message: 'no user with the provided id exists',
          },
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
          items: User,
        },
        400: BadRequestError,
        404: ResourceNotFoundError,
      },
    },
    handler: async function (req, reply) {
      const { ids } = req.query;
      if (ids.length === 0) {
        const errorResponse: BadRequestErrorType = {
          error: {
            message: 'No ids were provided in the querystring',
          },
        };
        return reply.status(400).send(errorResponse);
      }
      const idsArray = ids.split(',');
      const users = await this.mongo.db
        ?.collection('users')
        .find<UserType>({ id: { $in: idsArray } }, { projection: { _id: 0 } })
        .toArray();
      if (typeof users === 'undefined' || users.length === 0) {
        const errorResponse: ResourceNotFoundErrorType = {
          error: {
            values: idsArray,
            message: 'no users with the provided ids exist',
          },
        };
        return reply.status(404).send(errorResponse);
      }
      reply.send(users);
    },
  });

  /**
   * Get all users
   */
  fastify.route({
    method: 'GET',
    url: '/users/all',
    schema: {
      response: {
        200: {
          type: 'array',
          items: User,
        },
      },
    },
    handler: async function (req, reply) {
      const users = await this.mongo.db
        ?.collection('users')
        .find<UserType>({}, { projection: { _id: 0 } })
        .toArray();
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
    },
    handler: async function (req, reply) {
      const { id } = req.params;
      await this.mongo.db?.collection('users').deleteOne({ id });
      reply.status(204).send();
    },
  });

  /**
   * Delete all users
   */
  fastify.route({
    method: 'DELETE',
    url: '/users/all',
    handler: async function (req, reply) {
      await this.mongo.db?.collection('users').deleteMany({});
      reply.status(204).send();
    },
  });
};

export default userRoutes;
