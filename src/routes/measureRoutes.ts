import { Router } from 'express';
import { uploadMeasure, confirmMeasure, listMeasures } from '../controllers/measureController';

const router = Router();

// Rota para fazer o upload da leitura
// Método: POST
// Endpoint: /upload
// Corpo da requisição deve conter os dados da leitura a ser criada
router.post('/upload', uploadMeasure);

// Rota para confirmar uma leitura
// Método: PATCH
// Endpoint: /confirm
// Corpo da requisição deve conter o UUID da leitura e o valor confirmado
router.patch('/confirm', confirmMeasure);

// Rota para listar leituras de um cliente específico
// Método: GET
// Endpoint: /:customer_code/list
// Parâmetros: customer_code (parâmetro de URL), measure_type (opcional, query string)
router.get('/:customer_code/list', listMeasures);

export default router;
