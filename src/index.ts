import fastify from 'fastify';

const server = fastify();

server.route({
  method: 'GET',
  url: '/',
  handler: function (req, reply) {
    reply.send({ status: 'working' });
  },
});

const PORT = process.env.PORT ?? 3000;

const start = async () => {
  try {
    await server.listen(PORT);
    console.log(`Server started on http://localhost:${PORT}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
