import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { IParams, Product } from '../../interfaces/products.interface';

export default async function (fastify: FastifyInstance) {
  /**
   * GET all products
   */
  fastify.get(
    '/',
    async function (request: FastifyRequest, reply: FastifyReply) {
      const client = await fastify.pg.connect();

      try {
        const { rows } = await client.query(`SELECT * from products`);
        // ! Note: avoid doing expensive computation here, this will block releasing the client
        return rows;
      } catch (error) {
        console.error(error);
      } finally {
        // ! Release the client immediately after query resolves, or upon error
        client.release();
      }
    }
  );

  /**
   * GET one product by id
   */
  fastify.get(
    '/:id',
    async function (
      request: FastifyRequest<{ Params: IParams }>,
      reply: FastifyReply
    ) {
      const { id } = request.params;
      const client = await fastify.pg.connect();

      try {
        const { rows } = await client.query(
          `SELECT * from products WHERE id = $1`,
          [id]
        );
        // ! Note: avoid doing expensive computation here, this will block releasing the client
        return rows;
      } catch (error) {
        console.error(error);
      } finally {
        // ! Release the client immediately after query resolves, or upon error
        client.release();
      }
    }
  );

  /**
   * ADD new product
   */
  fastify.post(
    '/add',
    async function (
      request: FastifyRequest<{
        Body: Product;
      }>,
      reply: FastifyReply
    ) {
      const { title, description, price, brand, category, thumbnail } =
        request.body;
      const client = await fastify.pg.connect();

      try {
        const response = await client.query(
          `INSERT INTO products(title, description, price, brand, category, thumbnail) VALUES($1, $2, $3, $4, $5, $6) RETURNING id`,
          [title, description, price, brand, category, thumbnail]
        );
        // ! Note: avoid doing expensive computation here, this will block releasing the client
        return response;
      } catch (error) {
        console.error(error);
      } finally {
        // ! Release the client immediately after query resolves, or upon error
        client.release();
      }
    }
  );

  /** UPDATE product by id */
  fastify.put(
    '/:id',
    async function (
      request: FastifyRequest<{
        Params: IParams;
        Body: Product;
      }>,
      reply: FastifyReply
    ) {
      const { id } = request.params;
      const { title, description, price, brand, category, thumbnail } =
        request.body;
      const client = await fastify.pg.connect();

      try {
        const response = await client.query(
          `UPDATE products SET title = $1, description = $2, price = $3, brand = $4, category = $5, thumbnail = $6 WHERE id = $7`,
          [title, description, price, brand, category, thumbnail, id]
        );
        // ! Note: avoid doing expensive computation here, this will block releasing the client
        return response;
      } catch (error) {
        console.error(error);
      } finally {
        // ! Release the client immediately after query resolves, or upon error
        client.release();
      }
    }
  );

  /**
   * DELETE product by id
   */

  fastify.delete(
    '/:id',
    async function (
      request: FastifyRequest<{
        Params: IParams;
      }>,
      reply: FastifyReply
    ) {
      const { id } = request.params;
      const client = await fastify.pg.connect();

      try {
        const response = await client.query(
          `DELETE FROM products WHERE id = $1`,
          [id]
        );
        // ! Note: avoid doing expensive computation here, this will block releasing the client
        return response;
      } catch (error) {
        console.error(error);
      } finally {
        // ! Release the client immediately after query resolves, or upon error
        client.release();
      }
    }
  );
}
