"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCustomerService = void 0;
const client_1 = require("@prisma/client");
class CreateCustomerService {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    async execute(data) {
        // Validação dos dados recebidos
        const { name, email, phone, status, file } = data;
        if (!name || !email || !phone) {
            throw new Error('Preencher todos os campos: nome, email, telefone');
        }
        try {
            // Criação do cliente no banco de dados
            const customer = await this.prisma.customer.create({
                data: {
                    name,
                    email,
                    phone,
                    status,
                    image: file ? file.filename : null // Se não houver arquivo, mantém null
                },
            });
            return customer; // Retorna o cliente criado
        }
        catch (error) {
            console.error('Error while creating customer:', error);
            throw new Error('Erro ao criar cliente');
        }
    }
}
exports.CreateCustomerService = CreateCustomerService;
