import { FastifyPluginCallback } from 'fastify';
import { v4 as uuidv4 } from 'uuid';
import { getUserParams, getUserParamsType, NewUser, NewUserType, User } from '../typings/user.js';

const userRoutes: FastifyPluginCallback = async fastify => {
  fastify.route<{ Body: NewUserType }>({
    method: 'POST',
    url: '/users',
    schema: {
      body: NewUser,
      response: {
        200: User,
      },
    },
    handler: async function (req, reply) {
      const { body } = req;
      const newUser = { ...body, id: uuidv4() };
      await this.mongo.db?.collection('users').insertOne(newUser);
      reply.send(newUser);
    },
  });

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
};

export default userRoutes;
