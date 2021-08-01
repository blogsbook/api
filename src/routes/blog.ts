import { FastifyPluginCallback } from 'fastify';
import { v4 as uuidv4 } from 'uuid';
import { Blog, NewBlog, PartialBlog, updateBlogByIdParams } from '../schemas/blog';
import { BlogType, NewBlogType, PartialBlogType, updateBlogByIdParamsType } from '../typings/blog';

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
      },
    },
    handler: async function (req, reply) {
      const { body } = req;
      const createdBlog: BlogType = { ...body, id: uuidv4() };
      await this.mongo.db?.collection('blogs').insertOne(createdBlog);
      reply.status(201).send(createdBlog);
    },
  });

  /**
   * Update a blog by id
   */
  fastify.route<{ Params: updateBlogByIdParamsType; Body: PartialBlogType }>({
    method: 'PATCH',
    url: '/blogs/:id',
    schema: {
      params: updateBlogByIdParams,
      body: PartialBlog,
      response: {
        200: Blog,
      },
    },
    handler: async function (req, reply) {
      const { id } = req.params;
      const { body } = req;
      const updatedBlog = await this.mongo.db
        ?.collection('blogs')
        .findOneAndUpdate({ id }, { $set: body }, { projection: { _id: 0 }, returnDocument: 'after' });
      reply.send(updatedBlog?.value);
    },
  });
};

export default blogRoutes;
