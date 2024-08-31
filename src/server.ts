import express from 'express';
import measureRoutes from './routes/measureRoutes';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware para JSON
app.use(express.json());

// Middleware para CORS (caso necessário para o front-end)
app.use(cors());

// Rota Padrão
app.get('/', (req, res) => {
  res.send('API funcionando!');
});

// Rotas
app.use('/api', measureRoutes);

// Middleware para tratamento de erros globais
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack);
  res.status(500).send({
    error_code: 'SERVER_ERROR',
    error_description: 'Ocorreu um erro no servidor',
  });
});

// Iniciando o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
