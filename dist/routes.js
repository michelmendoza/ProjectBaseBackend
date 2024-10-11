"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = routes;
const CreateCustomerController_1 = require("./controllers/CreateCustomerController");
const ListCustomerController_1 = require("./controllers/ListCustomerController");
const DeleteCustomerController_1 = require("./controllers/DeleteCustomerController");
const util_1 = require("util");
const client_1 = require("@prisma/client"); // Supondo que você esteja usando Prisma
const stream_1 = require("stream");
const path_1 = require("path");
const fs_1 = require("fs");
const prisma = new client_1.PrismaClient();
const pump = (0, util_1.promisify)(stream_1.pipeline);
// Diretório de upload
const uploadDir = (0, path_1.join)(__dirname, '../src/uploads');
if (!(0, fs_1.existsSync)(uploadDir)) {
    (0, fs_1.mkdirSync)(uploadDir, { recursive: true });
}
async function routes(fastify, option) {
    fastify.get("/", async (request, reply) => {
        return { ok: true };
    });
    fastify.post("/customer", async (request, reply) => {
        // Processando o formulário multipart
        const parts = request.parts();
        let imagePath = null; // Para armazenar o caminho da imagem
        let customerData = {}; // Para armazenar dados do customer
        try {
            // Processando os dados e a imagem
            for await (const part of parts) {
                if (part.file) {
                    // É um arquivo (a imagem do cliente)
                    const filePath = (0, path_1.join)(uploadDir, part.filename);
                    const writeStream = (0, fs_1.createWriteStream)(filePath);
                    await pump(part.file, writeStream);
                    imagePath = `/uploads/${part.filename}`; // Caminho da imagem para salvar no banco de dados
                }
                else {
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
        }
        catch (error) {
            console.error('Error during customer creation:', error);
            reply.status(500).send({ message: 'Customer creation failed', error });
        }
        return new CreateCustomerController_1.CreateCustomerController().handle(request, reply);
    });
    fastify.get("/customer", async (request, reply) => {
        return new ListCustomerController_1.ListCustomerController().handle(request, reply);
    });
    fastify.delete("/customer", async (request, reply) => {
        return new DeleteCustomerController_1.DeleteCustomerController().handle(request, reply);
    });
}
