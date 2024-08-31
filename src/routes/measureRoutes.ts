import { Router } from 'express';
import { uploadMeasure, confirmMeasure, listMeasures } from '../controllers/measureController';

const router = Router();

// Rota para fazer o upload da leitura
router.post('/upload', uploadMeasure);

// Rota para confirmar uma leitura
router.patch('/confirm', confirmMeasure);

// Rota para listar leituras de um cliente específico
router.get('/:customer_code/list', listMeasures);

export default router;
