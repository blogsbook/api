import { createHash } from 'crypto';
import { FastifyPluginCallback } from 'fastify';
import jwt from 'jsonwebtoken';
import { BearerToken, PostCreateBearerToken } from '../schemas/auth';
import { BadRequestError, ResourceNotFoundError } from '../schemas/error';
import { BearerTokenType, PostCreateBearerTokenType } from '../typings/auth';
import { BadRequestErrorType, ResourceNotFoundErrorType } from '../typings/error';
import { UserType } from '../typings/user';

const authRoutes: FastifyPluginCallback = async fastify => {
  /**
   * Create a bearer token
   */
  fastify.route<{ Body: PostCreateBearerTokenType }>({
    method: 'POST',
    url: '/auth/token',
    schema: {
      body: PostCreateBearerToken,
      response: {
        201: BearerToken,
        400: BadRequestError,
        404: ResourceNotFoundError,
      },
    },
    handler: async function (req, reply) {
      const { username, password } = req.body;
      const user = await this.mongo.db?.collection('users').findOne<UserType>({ username }, { projection: { _id: 0 } });
      if (!user) {
        const errorResponse: ResourceNotFoundErrorType = {
          error: {
            values: [username],
            message: 'No user with the provided username exists',
          },
        };
        return reply.status(404).send(errorResponse);
      }
      if (password !== user.password) {
        const errorResponse: BadRequestErrorType = {
          error: {
            message: 'username and password do not match, please provide valid credentials',
          },
        };
        return reply.status(400).send(errorResponse);
      }
      const secretKey = createHash('sha256').update(`${username}${password}`).digest('hex');
      const bearerToken: BearerTokenType = {
        token: jwt.sign({ userId: user.id }, secretKey),
        type: 'bearer',
      };
      reply.status(201).send(bearerToken);
    },
  });
};

export default authRoutes;
