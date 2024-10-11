"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCustomerService = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const path_1 = require("path");
const fs_1 = require("fs");
const stream_1 = require("stream");
const util_1 = require("util");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const pump = (0, util_1.promisify)(stream_1.pipeline);
const uploadDir = (0, path_1.join)(__dirname, '../uploads');
if (!(0, fs_1.existsSync)(uploadDir)) {
    (0, fs_1.mkdirSync)(uploadDir, { recursive: true });
}
class CreateCustomerService {
    async execute({ name, email, phone, status, file }) {
        let imagePath = null;
        // Se houver uma imagem, processa e salva no diretório
        if (file) {
            const filePath = (0, path_1.join)(uploadDir, file.filename);
            const writeStream = (0, fs_1.createWriteStream)(filePath);
            await pump(file.file, writeStream);
            imagePath = `/uploads/${file.filename}`;
        }
        if (!name || !email || !phone) {
            throw new Error("Preencher todos os campos");
        }
        const customer = await prisma_1.default.customer.create({
            data: {
                name,
                email,
                phone,
                status,
                image: imagePath, // Adiciona o caminho da imagem ao cliente
            }
        });
        return customer;
    }
}
exports.CreateCustomerService = CreateCustomerService;
