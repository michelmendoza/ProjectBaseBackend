declare module 'fastify-multipart' {
  import { FastifyPluginCallback } from 'fastify';
  import { Readable } from 'stream';

  interface MultipartFile {
    fieldname: string;
    filename: string;
    file: Readable;
    // Adicione outros campos conforme necessário
  }

  interface FastifyMultipartOptions {
    addToBody?: boolean;
    limits?: {
      fileSize?: number;
    };
  }

  interface FastifyRequest {
    parts: () => AsyncIterable<MultipartFile>;
  }

  const fastifyMultipart: FastifyPluginCallback<FastifyMultipartOptions>;

  export default fastifyMultipart;
}
