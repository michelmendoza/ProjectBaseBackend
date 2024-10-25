import { FastifyInstance, FastifyReply } from 'fastify';
import { join } from 'path';
import { createWriteStream, existsSync, mkdirSync, createReadStream } from 'fs';
import { pipeline } from 'stream';
import { promisify } from 'util';
 import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'; // para ler arquivos

const pump = promisify(pipeline);


// // Define a pasta onde os arquivos serão armazenados
// const uploadDir = join(__dirname, '../src/uploads');
// if (!existsSync(uploadDir)) {
//   mkdirSync(uploadDir, { recursive: true });
// }
 

export const uploadRoute = async (fastify: FastifyInstance) => {
 

  // fastify.post('/uploads', async (request: any , reply:FastifyReply ) => {
  //   console.log('Processing upload...');
  //   const parts = request.parts();
  
  //   try {
  //     for await (const part of parts) {
  //       console.log(`Received part: ${part.filename}`);
  
  //       if (part.file) {
  //         const filePath = join(__dirname, 'uploads', part.filename);
  //         const writeStream = createWriteStream(filePath);
  //         await pump(part.file, writeStream);
  //         reply.send({ message: 'File uploaded successfully', filePath });
  //       } else {
  //         reply.status(400).send({ message: 'No file uploaded' });
  //       }
  //     }
  //   } catch (error) {
  //     console.error('Error during file upload:', error);
  //     reply.status(500).send({ message: 'File upload failed', error });
  //   }
  // }); 

  // // Rota para ler a imagem
  // fastify.get('/uploads/:filename', (request: any, reply) => {
  //   const { filename } = request.params;
  //   const filePath = join(uploadDir, filename);

  //   // Verifica se o arquivo existe
  //   if (!existsSync(filePath)) {
  //     return reply.status(404).send({ message: 'Image not found' });
  //   }

  //   // Lê o arquivo e envia como resposta
  //   const readStream = createReadStream(filePath);
  //   reply.type('image/jpeg'); // Ajuste o tipo de imagem conforme necessário
  //   readStream.pipe(reply.raw);
  // });

// Cloudinary

async function uploadImageCloudinary(filePath: string) {
  try {
    // Faz o upload da imagem para o Cloudinary
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'uploads/', // pasta onde os arquivos serão salvos no Cloudinary
    });

    // Opcionalmente, delete o arquivo local após o upload
    fs.unlinkSync(filePath);

    return result.secure_url; // retorna a URL segura do arquivo
  } catch (error) {
    console.error('Erro no upload de imagem:', error);
    throw new Error('Erro no upload de imagem');
  }
}

fastify.post('/uploads', async (req :any, reply) => {
  const data = await req.file(); // Supondo que você está usando algum middleware para lidar com arquivos como `fastify-multipart`
  const filePath = data.filepath;

  try {
    const imageUrl = await uploadImageCloudinary(filePath); // Função criada acima
    return { imageUrl }; // Retorna a URL para o front-end
  } catch (error) {
    reply.status(500).send('Erro ao fazer upload');
  }
});
}