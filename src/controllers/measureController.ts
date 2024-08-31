import { Request, Response } from 'express';
import { createMeasure, confirmMeasure as confirmMeasureService, listCustomerMeasures } from '../services/measureService';
import { validateRequestBody } from '../utils/validationUtils';

export const uploadMeasure = async (req: Request, res: Response) => {
  // Validação do corpo da requisição
  const errors = validateRequestBody(req, ['image', 'customer_code', 'measure_datetime', 'measure_type']);
  if (errors.length > 0) {
    return res.status(400).json({ error_code: 'INVALID_DATA', error_description: errors.join(', ') });
  }

  try {
    const measure = await createMeasure(req.body);
    res.status(201).json({
      image_url: measure.imageUrl,
      measure_value: measure.measureValue,
      measure_uuid: measure.measureUuid
    });
  } catch (error: any) {
    console.error('Erro ao criar a medida:', error);
    if (error.message === 'INVALID_DATA') {
      res.status(400).json({ error_code: 'INVALID_DATA', error_description: 'Invalid data provided' });
    } else if (error.message === 'DOUBLE_REPORT') {
      res.status(409).json({ error_code: 'DOUBLE_REPORT', error_description: 'Leitura do mês já realizada' });
    } else {
      res.status(500).json({ error_code: 'INTERNAL_ERROR', error_description: 'Internal server error' });
    }
  }
};

export const confirmMeasure = async (req: Request, res: Response) => {
  const { measure_uuid, confirmed_value } = req.body;

  // Validação dos dados
  const errors = validateRequestBody(req, ['measure_uuid', 'confirmed_value']);
  if (errors.length > 0) {
    return res.status(400).json({ error_code: 'INVALID_DATA', error_description: errors.join(', ') });
  }

  try {
    const result = await confirmMeasureService(measure_uuid, confirmed_value);
    if (result === 'not_found') {
      return res.status(404).json({ error_code: 'MEASURE_NOT_FOUND', error_description: 'Leitura não encontrada' });
    } else if (result === 'already_confirmed') {
      return res.status(409).json({ error_code: 'CONFIRMATION_DUPLICATE', error_description: 'Leitura já confirmada' });
    }
    res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('Erro ao confirmar a medida:', error); 
    res.status(500).json({ error_code: 'INTERNAL_ERROR', error_description: 'Internal server error' });
  }
};

export const listMeasures = async (req: Request, res: Response) => {
  const { customer_code } = req.params;
  let { measure_type } = req.query;

  // Validação do tipo de medida
  if (measure_type) {
    measure_type = (measure_type as string).toUpperCase();
    if (!['WATER', 'GAS'].includes(measure_type)) {
      return res.status(400).json({ error_code: 'INVALID_TYPE', error_description: 'Tipo de medição não permitida' });
    }
  }

  try {
    const measures = await listCustomerMeasures(customer_code, measure_type as string);
    if (measures.length === 0) {
      return res.status(404).json({ error_code: 'MEASURES_NOT_FOUND', error_description: 'Nenhuma leitura encontrada' });
    }
    res.status(200).json({
      customer_code,
      measures
    });
  } catch (error: any) {
    console.error('Erro ao listar as medidas:', error); 
    res.status(500).json({ error_code: 'INTERNAL_ERROR', error_description: 'Internal server error' });
  }
};
