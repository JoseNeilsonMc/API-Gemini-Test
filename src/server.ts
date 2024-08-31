import express from 'express';
import measureRoutes from './routes/measureRoutes';
import dotenv from 'dotenv';
import cors from 'cors';

// Carrega variáveis de ambiente do arquivo .env
dotenv.config();

const app = express();
const port = process.env.PORT || 3000; // Define a porta do servidor, usando 3000 como padrão

// Middleware para analisar JSON no corpo das requisições
app.use(express.json());

// Middleware para habilitar CORS (Cross-Origin Resource Sharing), permitindo requisições de diferentes origens
app.use(cors());

// Rota padrão para verificar se a API está funcionando
app.get('/', (req, res) => {
  res.send('API funcionando!');
});

// Configura as rotas do aplicativo, prefixadas com /api
app.use('/api', measureRoutes);

// Middleware para tratamento de erros globais
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack); // Loga o stack trace do erro no console
  res.status(500).send({
    error_code: 'SERVER_ERROR',
    error_description: 'Ocorreu um erro no servidor',
  }); // Envia uma resposta genérica de erro
});

// Inicia o servidor e escuta na porta definida
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
