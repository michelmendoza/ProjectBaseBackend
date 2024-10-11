"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListCustomerService = void 0;
const prisma_1 = __importDefault(require("../prisma"));
class ListCustomerService {
    async execute() {
        const customers = await prisma_1.default.customer.findMany();
        return customers;
    }
}
exports.ListCustomerService = ListCustomerService;
