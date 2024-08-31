# Usando a imagem base do Node.js versão 22-alpine para a construção da aplicação
FROM node:22-alpine AS build

# Definindo o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia o package.json e package-lock.json para o diretório de trabalho
# Isso é feito para instalar as dependências antes de copiar o restante do código,
# aproveitando o cache do Docker para acelerar a instalação de dependências
COPY package*.json ./

# Instala todas as dependências definidas no package.json
RUN npm install

# Copia todos os arquivos do projeto para o diretório de trabalho
COPY . .

# Compila o código TypeScript para JavaScript
# O comando 'npm run build' deve estar definido no package.json
# e normalmente cria um diretório 'dist' com o código compilado
RUN npm run build

# Gera o Prisma Client, que é necessário para interagir com o banco de dados
# O Prisma Client é gerado a partir do schema definido no arquivo prisma.schema
RUN npx prisma generate

# --- Segunda etapa para otimizar a imagem final ---

# Usando a imagem base do Node.js versão 22-alpine para a etapa final
FROM node:22-alpine

# Definindo o diretório de trabalho no contêiner final
WORKDIR /app

# Copia apenas os arquivos necessários da etapa de construção para a imagem final
# Isso inclui o diretório 'dist' (código compilado), 'node_modules' (dependências instaladas)
# e os arquivos 'package.json' e 'package-lock.json' (para verificar dependências)
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./

# Expondo a porta 3000 que a API usará
# Isso permite que o contêiner receba tráfego na porta especificada
EXPOSE 3000

# Define o comando padrão para iniciar o aplicativo
# No caso, o servidor é iniciado a partir do arquivo 'dist/server.js'
CMD ["node", "dist/server.js"]
