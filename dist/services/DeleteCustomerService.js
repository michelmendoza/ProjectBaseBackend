"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteCustomerService = void 0;
const prisma_1 = __importDefault(require("../prisma"));
class DeleteCustomerService {
    async execute({ id }) {
        if (!id) {
            throw new Error("Solicitação Incorreta");
        }
        const findCustomers = await prisma_1.default.customer.findFirst({
            where: {
                id: id
            }
        });
        if (!findCustomers) {
            throw new Error("Cliente não Existe!");
        }
        await prisma_1.default.customer.delete({
            where: {
                id: id
            }
        });
        return { message: "Deletado com sucesso!" };
    }
}
exports.DeleteCustomerService = DeleteCustomerService;
