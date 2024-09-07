import Fastify from "fastify";
import cors from "@fastify/cors"
import { routes } from "./routes";
import dotenv from 'dotenv';

dotenv.config();


const porta = process.env.PORT || 3000;


const app = Fastify({ logger:true})

const start = async () => {

    app.setErrorHandler((error, request, reply) => {
        reply.code(400).send({message:error.message})
    }) 

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