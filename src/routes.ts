import { FastifyInstance, FastifyPluginOptions, FastifyRequest, FastifyReply } from "fastify";
import { CreateCustomerController } from "./controllers/CreateCustomerController";
import { ListCustomerController } from "./controllers/ListCustomerController";
import { DeleteCustomerController } from "./controllers/DeleteCustomerController";
import { PrismaClient } from '@prisma/client'; // Supondo que você esteja usando Prisma
import { v2 as cloudinary } from 'cloudinary';
import { promisify } from 'util';
import { pipeline } from 'stream';

const prisma = new PrismaClient();
const pump = promisify(pipeline);

// Configurando o Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function routes(fastify: FastifyInstance, option: FastifyPluginOptions) {
  
  fastify.get("/", async (request: FastifyRequest, reply: FastifyReply) => {
    return { ok: true };
  });

  fastify.post("/customer", async (request: any, reply: FastifyReply) => {

    // Processando o formulário multipart
    const parts = request.parts();
    let imageUrl: string | null = null; // Para armazenar a URL da imagem no Cloudinary
    let customerData: any = {}; // Para armazenar dados do customer

    try {
      // Processando os dados e a imagem
      for await (const part of parts) {
        if (part.file) {
          // Faz o upload da imagem para o Cloudinary
          const uploadResult = await cloudinary.uploader.upload_stream({
            folder: 'customers' // Opcionalmente, uma pasta no Cloudinary para organizar os uploads
          }, async (error, result) => {
            if (error) {
              throw new Error('Erro no upload da imagem');
            }
            imageUrl = result?.secure_url || null; // URL segura da imagem no Cloudinary
          });

          await pump(part.file, uploadResult); // Fazendo o streaming do arquivo para o Cloudinary

        } else {
          // Caso contrário, é um campo de dados (ex: nome, email, etc)
          customerData[part.fieldname] = part.value;
        }
      }


      console.log("customerData:" + customerData)
      console.log("image:" + imageUrl)
      // Salvando o cliente no banco de dados, incluindo a URL da imagem
      const newCustomer = await prisma.customer.create({
        data: {
          ...customerData,
          status: true,
          image: imageUrl, // Salvando a URL da imagem
        },
      });

      reply.send({ message: 'Customer created successfully', newCustomer });
    } catch (error) {
      console.error('Error during customer creation:', error);
      reply.status(500).send({ message: 'Customer creation failed', error });
    }
    return new CreateCustomerController().handle(request, reply);
  });

  fastify.get("/customer", async (request: FastifyRequest, reply: FastifyReply) => {
    return new ListCustomerController().handle(request, reply);
  });

  fastify.delete("/customer", async (request: FastifyRequest, reply: FastifyReply) => {
    return new DeleteCustomerController().handle(request, reply);
  });
}
