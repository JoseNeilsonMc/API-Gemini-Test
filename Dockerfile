# Usando a imagem base do Node.js
FROM node:22-alpine AS build

# Definindo o diretório de trabalho
WORKDIR /app

# Copiar o package.json e package-lock.json
COPY package*.json ./

# Instalar todas as dependências
RUN npm install

# Copiar todos os arquivos do projeto
COPY . .

# Compilar o código TypeScript
RUN npm run build

# Gerar o Prisma Client
RUN npx prisma generate

# --- Segunda etapa para otimizar a imagem final ---
FROM node:22-alpine

WORKDIR /app

# Copiar apenas os arquivos necessários para rodar a aplicação
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./

# Expor a porta que a API utilizará
EXPOSE 3000

# Definir o comando para iniciar o aplicativo
CMD ["node", "dist/server.js"]
