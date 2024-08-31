import { Request } from 'express';

/**
 * Valida se todos os campos obrigatórios estão presentes no corpo da requisição.
 * @param req - A requisição Express.
 * @param requiredFields - Lista de campos obrigatórios.
 * @returns Lista de mensagens de erro, se houver.
 */
export const validateRequestBody = (req: Request, requiredFields: string[]): string[] => {
  const errors: string[] = [];
  const body = req.body;

  // Verifica se o corpo da requisição é um objeto
  if (typeof body !== 'object' || body === null) {
    errors.push('Invalid request body: Expected an object');
    return errors;
  }

  // Verifica se todos os campos obrigatórios estão presentes
  requiredFields.forEach(field => {
    if (!(field in body)) {
      errors.push(`Missing required field: ${field}`);
    }
  });

  return errors;
};
