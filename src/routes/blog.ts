import { createHash } from 'crypto';
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
import { ResourceNotFoundError, UnauthorizedRequestError } from '../schemas/error';
import {
  BlogType,
  DeleteBlogByIdParamsType,
  NewBlogType,
  PartialBlogType,
  PatchBlogByIdParamsType,
  PatchBlogByIdQueryType,
} from '../typings/blog';
import { ResourceNotFoundErrorType, UnauthorizedRequestErrorType } from '../typings/error';
import { UserType } from '../typings/user';

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
      const bearerToken = req.headers.authorization?.split(' ')[1];
      if (!bearerToken) {
        const errorResponse: UnauthorizedRequestErrorType = {
          error: {
            message: 'Please provide bearer token for authorization',
          },
        };
        return reply.status(401).send(errorResponse);
      }
      const { body } = req;
      const user = await this.mongo.db
        ?.collection('users')
        .findOne<UserType>({ id: body.authorId }, { projection: { _id: 0 } });
      const secretKey = createHash('sha256').update(`${user?.username}${user?.password}`).digest('hex');
      const { userId } = jwt.verify(bearerToken, secretKey) as { userId: string };
      if (!userId || userId !== body.authorId) {
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
        404: ResourceNotFoundError,
      },
    },
    handler: async function (req, reply) {
      const bearerToken = req.headers.authorization?.split(' ')[1];
      if (!bearerToken) {
        const errorResponse: UnauthorizedRequestErrorType = {
          error: {
            message: 'Please provide bearer token for authorization',
          },
        };
        return reply.status(401).send(errorResponse);
      }
      const { params, query, body } = req;
      const blog = await this.mongo.db
        ?.collection('blogs')
        .findOne<BlogType>({ id: params.id }, { projection: { _id: 0 } });
      if (!blog) {
        const errorResponse: ResourceNotFoundErrorType = {
          error: {
            values: [params.id],
            message: 'No blog with the provided id exists',
          },
        };
        return reply.status(404).send(errorResponse);
      }
      if (query.authorId !== blog.authorId) {
        const errorResponse: UnauthorizedRequestErrorType = {
          error: {
            message: "You cannot edit another user's blog",
          },
        };
        return reply.status(401).send(errorResponse);
      }
      const user = await this.mongo.db
        ?.collection('users')
        .findOne<UserType>({ id: query.authorId }, { projection: { _id: 0 } });
      const secretKey = createHash('sha256').update(`${user?.username}${user?.password}`).digest('hex');
      const { userId } = jwt.verify(bearerToken, secretKey) as { userId: string };
      if (!userId || userId !== query.authorId) {
        const errorResponse: UnauthorizedRequestErrorType = {
          error: {
            message: 'The user is not authorized to update the requested blog',
          },
        };
        return reply.status(401).send(errorResponse);
      }
      const updatedBlog = await this.mongo.db
        ?.collection('blogs')
        .findOneAndUpdate({ id: params.id }, { $set: body }, { projection: { _id: 0 }, returnDocument: 'after' });
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
        404: ResourceNotFoundError,
      },
    },
    handler: async function (req, reply) {
      const bearerToken = req.headers.authorization?.split(' ')[1];
      if (!bearerToken) {
        const errorResponse: UnauthorizedRequestErrorType = {
          error: {
            message: 'Please provide bearer token for authorization',
          },
        };
        return reply.status(401).send(errorResponse);
      }
      const { id } = req.params;
      const blog = await this.mongo.db?.collection('blogs').findOne<BlogType>({ id }, { projection: { _id: 0 } });
      if (!blog) {
        const errorResponse: ResourceNotFoundErrorType = {
          error: {
            values: [id],
            message: 'The blog to delete does not exist',
          },
        };
        return reply.status(404).send(errorResponse);
      }
      const user = await this.mongo.db
        ?.collection('users')
        .findOne<UserType>({ id: blog.authorId }, { projection: { _id: 0 } });
      const secretKey = createHash('sha256').update(`${user?.username}${user?.password}`).digest('hex');
      const { userId } = jwt.verify(bearerToken, secretKey) as { userId: string };
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
