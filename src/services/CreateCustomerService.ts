import prismaClient from "../prisma";
import { join } from 'path';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { pipeline } from 'stream';
import { promisify } from 'util';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const pump = promisify(pipeline);

const uploadDir = join(__dirname, '../uploads');
if (!existsSync(uploadDir)) {
  mkdirSync(uploadDir, { recursive: true });
}

interface CreateCustomerProps{
    name: string;
    email: string;
    phone: string; 
    status: boolean;
    file?: any; // Arquivo de imagem (opcional)
}

class CreateCustomerService {
    async execute({name,email,phone,status,  file}:CreateCustomerProps){
        let imagePath: string | null = null;
            // Se houver uma imagem, processa e salva no diretório
    if (file) {
        const filePath = join(uploadDir, file.filename);
        const writeStream = createWriteStream(filePath);
        await pump(file.file, writeStream);
        imagePath = `/uploads/${file.filename}`;
      }

       if(!name || !email|| !phone){
        throw new Error("Preencher todos os campos")
       }
   
        const customer = await prismaClient.customer.create({
        data:{
            name,
            email,
            phone,
            status,
            image: imagePath, // Adiciona o caminho da imagem ao cliente
        }
       })

        return customer
    }    
}

export { CreateCustomerService};