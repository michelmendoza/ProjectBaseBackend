"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadRoute = void 0;
const path_1 = require("path");
const fs_1 = require("fs");
const stream_1 = require("stream");
const util_1 = require("util");
const pump = (0, util_1.promisify)(stream_1.pipeline);
// Define a pasta onde os arquivos serão armazenados
const uploadDir = (0, path_1.join)(__dirname, '../src/uploads');
if (!(0, fs_1.existsSync)(uploadDir)) {
    (0, fs_1.mkdirSync)(uploadDir, { recursive: true });
}
const uploadRoute = async (fastify) => {
    fastify.post('/uploads', async (request, reply) => {
        console.log('Processing upload...');
        const parts = request.parts();
        try {
            for await (const part of parts) {
                console.log(`Received part: ${part.filename}`);
                if (part.file) {
                    const filePath = (0, path_1.join)(__dirname, 'uploads', part.filename);
                    const writeStream = (0, fs_1.createWriteStream)(filePath);
                    await pump(part.file, writeStream);
                    reply.send({ message: 'File uploaded successfully', filePath });
                }
                else {
                    reply.status(400).send({ message: 'No file uploaded' });
                }
            }
        }
        catch (error) {
            console.error('Error during file upload:', error);
            reply.status(500).send({ message: 'File upload failed', error });
        }
    });
    // Rota para ler a imagem
    fastify.get('/uploads/:filename', (request, reply) => {
        const { filename } = request.params;
        const filePath = (0, path_1.join)(uploadDir, filename);
        // Verifica se o arquivo existe
        if (!(0, fs_1.existsSync)(filePath)) {
            return reply.status(404).send({ message: 'Image not found' });
        }
        // Lê o arquivo e envia como resposta
        const readStream = (0, fs_1.createReadStream)(filePath);
        reply.type('image/jpeg'); // Ajuste o tipo de imagem conforme necessário
        readStream.pipe(reply.raw);
    });
};
exports.uploadRoute = uploadRoute;
