"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCustomerController = void 0;
const CreateCustomerService_1 = require("../services/CreateCustomerService");
class CreateCustomerController {
    async handle(request, reply) {
        const customerService = new CreateCustomerService_1.CreateCustomerService();
        // Parte para lidar com o upload de imagem e dados multipart
        const parts = request.parts();
        let customerData = {}; // Para armazenar os dados de cliente (name, email, phone)
        let imageFile = null; // Para armazenar o arquivo de imagem
        // Processa cada parte do formulário multipart
        for await (const part of parts) {
            if (part.file) {
                // Se for um arquivo, captura o arquivo de imagem
                imageFile = part;
            }
            else {
                // Se for um campo, armazena os dados do cliente
                customerData[part.fieldname] = part.value;
            }
        }
        // Agora chamamos o service com os dados do cliente e o arquivo de imagem
        // Chama o service com os dados do cliente e o arquivo de imagem
        const customer = await customerService.execute({
            name: customerData.name,
            email: customerData.email,
            phone: customerData.phone,
            status: customerData.status,
            file: imageFile, // Passando o arquivo de imagem para a service
        });
        reply.send(customer);
    }
}
exports.CreateCustomerController = CreateCustomerController;
