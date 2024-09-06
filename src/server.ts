import Fastify from "fastify";
import cors from "@fastify/cors"
import { routes } from "./routes";

const app = Fastify({ logger:true})

const start = async () => {

    app.setErrorHandler((error, request, reply) => {
        reply.code(400).send({message:error.message})
    }) 

    await app.register(routes)
    await app.register(cors)

        try {
            await app.listen({port:3333})
        }
    catch (err) {
        process.exit(1);
    }
}
start();