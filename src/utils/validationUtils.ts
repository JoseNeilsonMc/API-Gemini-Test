import { Request } from 'express';

/**
 * Valida se todos os campos obrigatórios estão presentes no corpo da requisição.
 * @param req - A requisição Express, contendo o corpo da requisição.
 * @param requiredFields - Lista de campos obrigatórios que devem estar presentes no corpo da requisição.
 * @returns Lista de mensagens de erro, se houver.
 */
export const validateRequestBody = (req: Request, requiredFields: string[]): string[] => {
  const errors: string[] = []; // Lista para armazenar mensagens de erro
  const body = req.body; // Corpo da requisição

  // Verifica se o corpo da requisição é um objeto e não é nulo
  if (typeof body !== 'object' || body === null) {
    errors.push('Invalid request body: Expected an object');
    return errors; // Retorna a lista de erros se o corpo não for um objeto
  }

  // Verifica se todos os campos obrigatórios estão presentes no corpo da requisição
  requiredFields.forEach(field => {
    if (!(field in body)) {
      errors.push(`Missing required field: ${field}`); // Adiciona uma mensagem de erro se um campo obrigatório estiver faltando
    }
  });

  return errors; // Retorna a lista de erros encontrados
};
