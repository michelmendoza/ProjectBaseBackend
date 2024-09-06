# backend-base

Este repositório contém a base de um projeto Backend, projetado para funcionar em conjunto com um Frontend desenvolvido em React JS + TypeScript. O backend utiliza **Fastify** como framework web, **Prisma** como ORM e **TypeScript** como linguagem principal.

## Sumário

- [Visão Geral](#visão-geral)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Instalação](#instalação)
- [Uso](#uso)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Contribuição](#contribuição)
- [Licença](#licença)

## Visão Geral

O **backend-base** é um ponto de partida para criar uma aplicação backend utilizando **Fastify** para o gerenciamento de rotas, **Prisma** para a interação com o banco de dados e **TypeScript** para garantir um desenvolvimento mais seguro e estruturado.

## Tecnologias Utilizadas

- **Node.js**
- **Fastify** (framework web)
- **Prisma** (ORM)
- **TypeScript**
- **Cors** (gerenciamento de políticas de origem cruzada)

## Instalação

Siga os passos abaixo para configurar o projeto localmente:

1. Clone o repositório:

   ```bash
   git clone git@github.com:michelmendoza/ProjectBaseBackend.git
   cd ProjectBaseBackend
   ```

2. Instale as dependências do projeto:

   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:

   Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis de ambiente necessárias para configurar o Prisma e o banco de dados:

   ```bash
   DATABASE_URL="your_database_url_here"
   ```

4. Execute as migrações do Prisma (se necessário):

   ```bash
   npx prisma migrate dev
   ```

## Uso

Para rodar o servidor em modo de desenvolvimento, use o comando abaixo. O projeto está configurado para observar mudanças automaticamente e recarregar o servidor:

```bash
npm run dev
```

O servidor será iniciado em `http://localhost:3000`, ou na porta configurada no arquivo `.env`.

## Scripts Disponíveis

- **`npm run dev`**: Inicia o servidor em modo de desenvolvimento com observação de arquivos.
- **`npx prisma migrate dev`**: Executa as migrações do banco de dados.
- **`npx prisma studio`**: Abre o Prisma Studio, uma interface gráfica para gerenciar os dados do banco.

## Contribuição

Se você deseja contribuir com o projeto, siga as instruções abaixo:

1. Faça um fork do projeto.
2. Crie uma nova branch (`git checkout -b feature/sua-feature`).
3. Faça as alterações desejadas e commit (`git commit -am 'Adiciona nova feature'`).
4. Faça push para a branch criada (`git push origin feature/sua-feature`).
5. Crie um Pull Request.

## Licença

Este projeto está licenciado sob a licença **ISC**. Consulte o arquivo [LICENSE](LICENSE) para mais informações.
```

### Pontos importantes:
- **Nome do projeto**: Atualizei o nome do projeto com base no `package.json`.
- **Tecnologias**: Listei as tecnologias baseadas nas dependências do projeto.
- **Scripts**: Instruções sobre como rodar o projeto em modo de desenvolvimento e como gerenciar o banco de dados com o Prisma.
- **Licença**: O projeto está licenciado sob a licença ISC, conforme o `package.json`.

