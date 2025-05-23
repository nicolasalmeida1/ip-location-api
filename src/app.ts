import Fastify, { FastifyInstance } from 'fastify';
import { PingRoute, IpLocationRoute } from './infrastructure/routes';
import IpLocationService from './domain/services/location-by-ip.service';
import IpLocationCommandFactory from './infrastructure/factories/ip-location-command.factory';

/**
 * Creates and configures a Fastify application instance.
 * Initializes the IP location service and command factory,
 * and registers application routes.
 *
 * @returns {FastifyInstance} A Promise that resolves to the configured FastifyInstance.
 */
export async function createApp(): Promise<FastifyInstance> {
  const server = Fastify();

  const ipLocationService = new IpLocationService();
  await ipLocationService.loadData();

  IpLocationCommandFactory.init(ipLocationService);

  new PingRoute(server);
  new IpLocationRoute(server);

  return server;
}
