import { PrismaClient } from '@prisma/client';

class CreateCustomerService {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async execute(data: { name: string; email: string; phone: string; status: boolean; file: any }) {
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
        } catch (error) {
            console.error('Error while creating customer:', error);
            throw new Error('Erro ao criar cliente');
        }
    }
}

export { CreateCustomerService };
