import Fastify from 'fastify';
import autoLoad from 'fastify-autoload';
import cors from 'fastify-cors';
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

fastify.register(cors, {
  origin: '*',
});

fastify.register(autoLoad, {
  dir: join(__dirname, 'routes'),
});

const PORT = process.env.PORT ?? 3000;

const start = async () => {
  try {
    let address;
    if (process.env.NODE_ENV === 'production') {
      address = await fastify.listen(PORT, '0.0.0.0');
    } else {
      address = await fastify.listen(PORT);
    }
    console.log(`Server listening to ${address}`);
  } catch (err) {
    console.log(err);
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
