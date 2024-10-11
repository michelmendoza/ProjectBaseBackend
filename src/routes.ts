import { FastifyInstance, FastifyPluginOptions, FastifyRequest,FastifyReply } from "fastify";
import { CreateCustomerController } from "./controllers/CreateCustomerController";
import { ListCustomerController } from "./controllers/ListCustomerController";
import { DeleteCustomerController } from "./controllers/DeleteCustomerController";
import { promisify } from 'util';
import { PrismaClient } from '@prisma/client'; // Supondo que você esteja usando Prisma
import { pipeline } from 'stream';
import { join } from 'path';
import { createWriteStream, existsSync, mkdirSync } from 'fs';

const prisma = new PrismaClient();
const pump = promisify(pipeline);

// Diretório de upload
const uploadDir = join(__dirname, '../src/uploads');
if (!existsSync(uploadDir)) {
  mkdirSync(uploadDir, { recursive: true });
}




export async function routes(fastify:FastifyInstance , option:FastifyPluginOptions ) {
    
    fastify.get("/", async (request: FastifyRequest , reply:FastifyReply ) => {
        return {ok:true}
    })

    fastify.post("/customer", async (request: any , reply:FastifyReply ) => {

 // Processando o formulário multipart
 const parts = request.parts();
 let imagePath: string | null = null; // Para armazenar o caminho da imagem
 let customerData: any = {}; // Para armazenar dados do customer

 try {
    // Processando os dados e a imagem
    for await (const part of parts) {
      if (part.file) {
        // É um arquivo (a imagem do cliente)
        const filePath = join(uploadDir, part.filename);
        const writeStream = createWriteStream(filePath);
        await pump(part.file, writeStream);
        imagePath = `/uploads/${part.filename}`; // Caminho da imagem para salvar no banco de dados
      } else {
        // Caso contrário, é um campo de dados (ex: nome, email, etc)
        customerData[part.fieldname] = part.value;
      }
    }

     // Salvando o cliente no banco de dados, incluindo o caminho da imagem
     const newCustomer = await prisma.customer.create({
        data: {
          ...customerData,
          status: true,
          image: imagePath, // Salvando o caminho da imagem
        },
      });

      reply.send({ message: 'Customer created successfully', newCustomer });
    } catch (error) {
      console.error('Error during customer creation:', error);
      reply.status(500).send({ message: 'Customer creation failed', error });
    }
        return new CreateCustomerController().handle(request,reply)
    })

    fastify.get("/customer", async (request: FastifyRequest , reply:FastifyReply ) => {
        return new ListCustomerController().handle(request,reply)
    })

    fastify.delete("/customer", async (request: FastifyRequest , reply:FastifyReply ) => {
        return new DeleteCustomerController().handle(request,reply)
    })

}