import { FastifyInstance, FastifyRequest } from 'fastify';
import { NotFoundError } from '../../domain/errors/not-found.error';
import IpLocationCommandFactory from '../factories/ip-location-command.factory';
import { errorMessage } from '../../domain/enums';

export default class IpLocationRoute {
  constructor(server: FastifyInstance) {
    server.get(
      '/ip/location',
      async (request: FastifyRequest<{ Querystring: { ip: string } }>, reply) => {
        const ip = request.query.ip as string;

        const command = IpLocationCommandFactory.create();

        try {
          const result = command.execute(ip);
          reply.send(result);
        } catch (err) {
          if (err instanceof NotFoundError) {
            reply.status(404).send({ message: err.message });
          } else {
            reply.status(500).send({ message: errorMessage.internalServerError });
          }
        }
      }
    );
  }
}
