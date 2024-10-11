"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const routes_1 = require("./routes");
const dotenv_1 = __importDefault(require("dotenv"));
const fastify_multipart_1 = __importDefault(require("fastify-multipart"));
const uploadRoute_1 = require("./uploadRoute");
dotenv_1.default.config();
const porta = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
console.log(`Servidor rodando na porta: ${porta}`);
const app = (0, fastify_1.default)({ logger: true });
// Registrar o plugin de multipart
app.register(fastify_multipart_1.default, {
    limits: { fileSize: 1000000 } // Limitar o tamanho do arquivo (opcional)
});
const start = async () => {
    app.setErrorHandler((error, request, reply) => {
        reply.code(400).send({ message: error.message });
    });
    // Registrar as rotas 
    await app.register(uploadRoute_1.uploadRoute);
    await app.register(routes_1.routes);
    await app.register(cors_1.default);
    try {
        await app.listen({ port: porta });
    }
    catch (err) {
        process.exit(1);
    }
};
start();
