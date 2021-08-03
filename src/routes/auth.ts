import { randomBytes } from 'crypto';
import { FastifyPluginCallback } from 'fastify';
import jwt from 'jsonwebtoken';
import { AccessToken, BearerToken, PostCreateAccessToken, PostCreateBearerToken } from '../schemas/auth';
import { BadRequestError, ResourceNotFoundError } from '../schemas/error';
import {
  AccessTokenType,
  BearerTokenType,
  PostCreateAccessTokenType,
  PostCreateBearerTokenType,
} from '../typings/auth';
import { BadRequestErrorType, ResourceNotFoundErrorType } from '../typings/error';
import { UserType } from '../typings/user';

const authRoutes: FastifyPluginCallback = async fastify => {
  /**
   * Create an access token
   */
  fastify.route<{ Body: PostCreateAccessTokenType }>({
    method: 'POST',
    url: '/auth/authorize',
    schema: {
      body: PostCreateAccessToken,
      response: {
        201: AccessToken,
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
      if (user.password !== password) {
        const errorResponse: BadRequestErrorType = {
          error: {
            message: 'username and password do not match, please provide valid credentials',
          },
        };
        return reply.status(400).send(errorResponse);
      }
      const accessToken: AccessTokenType = {
        type: 'accessToken',
        token: randomBytes(64).toString('hex'),
        userId: user.id,
      };
      await this.mongo.db?.collection('access-tokens').insertOne(accessToken);
      reply.status(201).send(accessToken);
    },
  });

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
      const { username, accessToken } = req.body;
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
      const accessTokenDoc = await this.mongo.db
        ?.collection('access-tokens')
        .findOne<AccessTokenType>({ token: accessToken }, { projection: { _id: 0 } });
      if (!accessTokenDoc) {
        const errorResponse: ResourceNotFoundErrorType = {
          error: {
            values: [accessToken],
            message: 'The provided accessToken does not exists, please create a new one',
          },
        };
        return reply.status(404).send(errorResponse);
      }
      const { id } = user;
      if (id !== accessTokenDoc.userId) {
        const errorResponse: BadRequestErrorType = {
          error: {
            message: 'Please provide valid credentials',
          },
        };
        return reply.status(400).send(errorResponse);
      }
      const bearerToken: BearerTokenType = {
        token: jwt.sign({ userId: id }, accessToken),
        type: 'bearer',
      };
      reply.status(201).send(bearerToken);
    },
  });
};

export default authRoutes;
