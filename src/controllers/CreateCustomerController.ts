import { FastifyRequest, FastifyReply } from "fastify";
import { CreateCustomerService } from "../services/CreateCustomerService";

class CreateCustomerController {
    async handle(request: any, reply: FastifyReply) {
        const customerService = new CreateCustomerService();
        console.log("Received request:", request.body);

        // Parte para lidar com o upload de imagem e dados multipart
        const parts = request.parts();
        let customerData: any = {}; // Para armazenar os dados de cliente (name, email, phone)
        let imageFile: any = null;  // Para armazenar o arquivo de imagem

        // Processa cada parte do formulário multipart
        for await (const part of parts) {
            if (part.file) {
                // Se for um arquivo, captura o arquivo de imagem
                imageFile = part;
            } else {
                // Se for um campo, armazena os dados do cliente
                customerData[part.fieldname] = part.value;
            }
        }

        console.log("customerData:", customerData);
        console.log("imageFile:", imageFile);

        // Chama o service com os dados do cliente e o arquivo de imagem
        try {
            const customer = await customerService.execute({
                name: customerData.name,
                email: customerData.email,
                phone: customerData.phone,
                status: customerData.status || true, // Adiciona um valor padrão se o status não estiver presente
                file: imageFile, // Passando o arquivo de imagem para a service
            });

            console.log("Customer created:", customer);
            // Responde com o cliente criado
            reply.send({ message: 'Customer created successfully', customer });
        } catch (error: unknown) {
            console.error('Error during customer creation:', error);

            // Verifica se o erro é uma instância de Error
            if (error instanceof Error) {
                reply.status(500).send({ message: 'Customer creation failed', error: error.message });
            } else {
                // Caso o erro não seja um objeto Error, envie uma mensagem genérica
                reply.status(500).send({ message: 'Customer creation failed', error: 'Unknown error' });
            }
        }
    }
}

export { CreateCustomerController };
