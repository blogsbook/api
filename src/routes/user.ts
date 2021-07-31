import { FastifyPluginCallback } from 'fastify';
import { v4 as uuidv4 } from 'uuid';
import { getUserParams, getUserParamsType, NewUser, NewUserType, User } from '../typings/user.js';

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
      const newUser = { ...body, id: uuidv4() };
      await this.mongo.db?.collection('users').insertOne(newUser);
      reply.status(201).send(newUser);
    },
  });

  /**
   * Get a single user
   */
  fastify.route<{ Params: getUserParamsType }>({
    method: 'GET',
    url: '/users/:id',
    schema: {
      params: getUserParams,
      response: {
        200: User,
      },
    },
    handler: async function (req, reply) {
      const { id } = req.params;
      const user = await this.mongo.db?.collection('users').findOne({ id });
      reply.send(user);
    },
  });

  /**
   * Get all users
   */
  fastify.route({
    method: 'GET',
    url: '/users',
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
        .find({}, { projection: { _id: 0 } })
        .toArray();
      reply.send(users);
    },
  });
};

export default userRoutes;
