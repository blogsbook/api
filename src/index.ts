import Fastify from 'fastify';
import autoLoad from 'fastify-autoload';
import fastifyMongodb from 'fastify-mongodb';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const fastify = Fastify();

fastify.register(fastifyMongodb, {
  forceClose: true,
  url: process.env.BLOGSBOOK_ATLAS_URI,
});

fastify.register(autoLoad, {
  dir: join(__dirname, 'routes'),
});

const PORT = process.env.PORT ?? 3000;

const start = async () => {
  try {
    const address = await fastify.listen(PORT);
    console.log(`Server started on ${address}`);
  } catch (err) {
    console.log(err);
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
