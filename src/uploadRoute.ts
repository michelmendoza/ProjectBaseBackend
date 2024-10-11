import { FastifyInstance, FastifyReply } from 'fastify';
import { join } from 'path';
import { createWriteStream, existsSync, mkdirSync, createReadStream } from 'fs';
import { pipeline } from 'stream';
import { promisify } from 'util';

const pump = promisify(pipeline);


// Define a pasta onde os arquivos serão armazenados
const uploadDir = join(__dirname, '../src/uploads');
if (!existsSync(uploadDir)) {
  mkdirSync(uploadDir, { recursive: true });
}
 

export const uploadRoute = async (fastify: FastifyInstance) => {
 

  fastify.post('/uploads', async (request: any , reply:FastifyReply ) => {
    console.log('Processing upload...');
    const parts = request.parts();
  
    try {
      for await (const part of parts) {
        console.log(`Received part: ${part.filename}`);
  
        if (part.file) {
          const filePath = join(__dirname, 'uploads', part.filename);
          const writeStream = createWriteStream(filePath);
          await pump(part.file, writeStream);
          reply.send({ message: 'File uploaded successfully', filePath });
        } else {
          reply.status(400).send({ message: 'No file uploaded' });
        }
      }
    } catch (error) {
      console.error('Error during file upload:', error);
      reply.status(500).send({ message: 'File upload failed', error });
    }
  }); 

  // Rota para ler a imagem
  fastify.get('/uploads/:filename', (request: any, reply) => {
    const { filename } = request.params;
    const filePath = join(uploadDir, filename);

    // Verifica se o arquivo existe
    if (!existsSync(filePath)) {
      return reply.status(404).send({ message: 'Image not found' });
    }

    // Lê o arquivo e envia como resposta
    const readStream = createReadStream(filePath);
    reply.type('image/jpeg'); // Ajuste o tipo de imagem conforme necessário
    readStream.pipe(reply.raw);
  });


}