import { FastifyPluginCallback } from 'fastify';

const homeRoute: FastifyPluginCallback = async fastify => {
  fastify.route({
    method: 'GET',
    url: '/',
    handler: async function (req, reply) {
      reply.send({ status: 'working' });
    },
  });
};

export default homeRoute;
