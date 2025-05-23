/* eslint-disable no-unused-vars */
import { FastifyInstance, RouteShorthandOptions } from 'fastify';

export default class PingRoute {
  constructor(server: FastifyInstance) {
    const opts: RouteShorthandOptions = {
      schema: {
        response: {
          200: {
            type: 'object',
            properties: {
              pong: { type: 'string' },
            },
          },
        },
      },
    };

    server.get('/ping', opts, async (request, reply) => {
      return { pong: 'it worked!' };
    });
  }
}
