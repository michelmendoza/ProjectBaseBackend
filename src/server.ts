import Fastify from "fastify";
import cors from "@fastify/cors"
import { routes } from "./routes";
import dotenv from 'dotenv';
import fastifyMultipart from 'fastify-multipart';
import { uploadRoute } from './uploadRoute';

dotenv.config();
 
const porta = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

console.log(`Servidor rodando na porta: ${porta}`);

const app = Fastify({ logger:true})

// Registrar o plugin de multipart
app.register(fastifyMultipart, {
    limits: { fileSize: 1000000 } // Limitar o tamanho do arquivo (opcional)
  });



const start = async () => {

    app.setErrorHandler((error, request, reply) => {
        reply.code(400).send({message:error.message})
    }) 

    // Registrar as rotas 
    // await app.register(uploadRoute);
    await app.register(routes)
    await app.register(cors)

        try {
            await app.listen({port:porta})
        }
    catch (err) {
        process.exit(1);
    }
}


start();