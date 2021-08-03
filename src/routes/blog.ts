import { FastifyPluginCallback } from 'fastify';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import {
  Blog,
  DeleteBlogByIdParams,
  NewBlog,
  PartialBlog,
  PatchBlogByIdParams,
  PatchBlogByIdQuery,
} from '../schemas/blog';
import { UnauthorizedRequestError } from '../schemas/error';
import { AccessTokenType } from '../typings/auth';
import {
  BlogType,
  DeleteBlogByIdParamsType,
  NewBlogType,
  PartialBlogType,
  PatchBlogByIdParamsType,
  PatchBlogByIdQueryType,
} from '../typings/blog';
import { ResourceNotFoundErrorType, UnauthorizedRequestErrorType } from '../typings/error';

const blogRoutes: FastifyPluginCallback = async fastify => {
  /**
   * Create a new blog
   */
  fastify.route<{ Body: NewBlogType }>({
    method: 'POST',
    url: '/blogs',
    schema: {
      body: NewBlog,
      response: {
        201: Blog,
        401: UnauthorizedRequestError,
      },
    },
    handler: async function (req, reply) {
      const { body } = req;
      const { authorId } = body;
      const bearerToken = req.headers.authorization?.split(' ')[1];
      if (!bearerToken) {
        const errorResponse: UnauthorizedRequestErrorType = {
          error: {
            message: 'Please provide bearer token for authorization',
          },
        };
        return reply.status(401).send(errorResponse);
      }
      const accessTokenDoc = await this.mongo.db
        ?.collection('access-tokens')
        .findOne<AccessTokenType>({ userId: authorId }, { projection: { _id: 0 } });
      if (!accessTokenDoc) {
        const errorResponse: UnauthorizedRequestErrorType = {
          error: {
            message: 'The provided bearer token has been expired, please re-authorize',
          },
        };
        return reply.status(401).send(errorResponse);
      }
      const { userId } = jwt.verify(bearerToken, accessTokenDoc.token) as { userId: string };
      if (!userId || userId !== authorId) {
        const errorResponse: UnauthorizedRequestErrorType = {
          error: {
            message: 'The user is not authorized to create the requested blog',
          },
        };
        return reply.status(401).send(errorResponse);
      }
      const createdBlog: BlogType = { ...body, id: uuidv4() };
      await this.mongo.db?.collection('blogs').insertOne(createdBlog);
      reply.status(201).send(createdBlog);
    },
  });

  /**
   * Update a blog by id
   */
  fastify.route<{ Params: PatchBlogByIdParamsType; Querystring: PatchBlogByIdQueryType; Body: PartialBlogType }>({
    method: 'PATCH',
    url: '/blogs/:id',
    schema: {
      params: PatchBlogByIdParams,
      querystring: PatchBlogByIdQuery,
      body: PartialBlog,
      response: {
        200: Blog,
        401: UnauthorizedRequestError,
      },
    },
    handler: async function (req, reply) {
      const { params, query, body } = req;
      const { id } = params;
      const { authorId } = query;
      const bearerToken = req.headers.authorization?.split(' ')[1];
      if (!bearerToken) {
        const errorResponse: UnauthorizedRequestErrorType = {
          error: {
            message: 'Please provide bearer token for authorization',
          },
        };
        return reply.status(401).send(errorResponse);
      }
      const accessTokenDoc = await this.mongo.db
        ?.collection('access-tokens')
        .findOne<AccessTokenType>({ userId: authorId }, { projection: { _id: 0 } });
      if (!accessTokenDoc) {
        const errorResponse: UnauthorizedRequestErrorType = {
          error: {
            message: 'The provided bearer token has been expired, please re-authorize',
          },
        };
        return reply.status(401).send(errorResponse);
      }
      const { userId } = jwt.verify(bearerToken, accessTokenDoc.token) as { userId: string };
      if (!userId || userId !== authorId) {
        const errorResponse: UnauthorizedRequestErrorType = {
          error: {
            message: 'The user is not authorized to update the requested blog',
          },
        };
        return reply.status(401).send(errorResponse);
      }
      const updatedBlog = await this.mongo.db
        ?.collection('blogs')
        .findOneAndUpdate({ id }, { $set: body }, { projection: { _id: 0 }, returnDocument: 'after' });
      reply.send(updatedBlog?.value);
    },
  });

  /**
   * Delete a blog by id
   */
  fastify.route<{ Params: DeleteBlogByIdParamsType }>({
    method: 'DELETE',
    url: '/blogs/:id',
    schema: {
      params: DeleteBlogByIdParams,
      response: {
        401: UnauthorizedRequestError,
      },
    },
    handler: async function (req, reply) {
      const { id } = req.params;
      const bearerToken = req.headers.authorization?.split(' ')[1];
      if (!bearerToken) {
        const errorResponse: UnauthorizedRequestErrorType = {
          error: {
            message: 'Please provide bearer token for authorization',
          },
        };
        return reply.status(401).send(errorResponse);
      }
      const blog = await this.mongo.db?.collection('blogs').findOne<BlogType>({ id }, { projection: { _id: 0 } });
      if (!blog) {
        const errorResponse: ResourceNotFoundErrorType = {
          error: {
            values: [id],
            message: 'The blog to delete does not exist',
          },
        };
        return reply.status(401).send(errorResponse);
      }
      const accessTokenDoc = await this.mongo.db
        ?.collection('access-tokens')
        .findOne<AccessTokenType>({ userId: blog.authorId }, { projection: { _id: 0 } });
      if (!accessTokenDoc) {
        const errorResponse: UnauthorizedRequestErrorType = {
          error: {
            message: 'The provided bearer token has been expired, please re-authorize',
          },
        };
        return reply.status(401).send(errorResponse);
      }
      const { userId } = jwt.verify(bearerToken, accessTokenDoc.token) as { userId: string };
      if (!userId || userId !== blog.authorId) {
        const errorResponse: UnauthorizedRequestErrorType = {
          error: {
            message: 'The user is not authorized to delete the requested blog',
          },
        };
        return reply.status(401).send(errorResponse);
      }
      await this.mongo.db?.collection('blogs').deleteOne({ id });
      reply.status(204).send();
    },
  });
};

export default blogRoutes;
