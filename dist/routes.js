"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = routes;
const CreateCustomerController_1 = require("./controllers/CreateCustomerController");
const ListCustomerController_1 = require("./controllers/ListCustomerController");
const DeleteCustomerController_1 = require("./controllers/DeleteCustomerController");
const client_1 = require("@prisma/client"); // Supondo que você esteja usando Prisma
const cloudinary_1 = require("cloudinary");
const util_1 = require("util");
const stream_1 = require("stream");
const prisma = new client_1.PrismaClient();
const pump = (0, util_1.promisify)(stream_1.pipeline);
// Configurando o Cloudinary
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
async function routes(fastify, option) {
    fastify.get("/", async (request, reply) => {
        return { ok: true };
    });
    fastify.post("/customer", async (request, reply) => {
        // Processando o formulário multipart
        const parts = request.parts();
        let imageUrl = null; // Para armazenar a URL da imagem no Cloudinary
        let customerData = {}; // Para armazenar dados do customer
        try {
            // Processando os dados e a imagem
            for await (const part of parts) {
                if (part.file) {
                    // Faz o upload da imagem para o Cloudinary
                    const uploadResult = await cloudinary_1.v2.uploader.upload_stream({
                        folder: 'customers' // Opcionalmente, uma pasta no Cloudinary para organizar os uploads
                    }, async (error, result) => {
                        if (error) {
                            throw new Error('Erro no upload da imagem');
                        }
                        imageUrl = (result === null || result === void 0 ? void 0 : result.secure_url) || null; // URL segura da imagem no Cloudinary
                    });
                    await pump(part.file, uploadResult); // Fazendo o streaming do arquivo para o Cloudinary
                }
                else {
                    // Caso contrário, é um campo de dados (ex: nome, email, etc)
                    customerData[part.fieldname] = part.value;
                }
            }
            console.log("customerData:" + customerData);
            console.log("image:" + imageUrl);
            // Salvando o cliente no banco de dados, incluindo a URL da imagem
            const newCustomer = await prisma.customer.create({
                data: {
                    ...customerData,
                    status: true,
                    image: imageUrl, // Salvando a URL da imagem
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
