# Usando a imagem base do Node.js
FROM node:18-alpine

# Definindo o diretório de trabalho
WORKDIR /app

# Copiar o package.json e package-lock.json e instalar dependências
COPY package*.json ./
RUN npm install --production

# Copiar todos os arquivos do projeto
COPY . .

# Compilar o código TypeScript
RUN npm run build

# Gerar o Prisma Client
RUN npx prisma generate

# Expor a porta que a API utilizará
EXPOSE 3000

# Definir o comando para iniciar o aplicativo
CMD ["node", "dist/server.js"]
