import { PrismaClient } from '@prisma/client';
import { extractMeasureFromImage } from './geminiService';
import { AxiosError } from 'axios';

// Interface para os dados da medição
interface MeasureData {
  image: string;
  customer_code: string;
  measure_datetime: string;
  measure_type: string;
}

// Interface para a resposta de erro esperada da API
interface ErrorResponse {
  message: string;
}

// Função de guarda para verificar se um erro é um AxiosError
const isAxiosError = (error: unknown): error is AxiosError<ErrorResponse> => {
  return (error as AxiosError<ErrorResponse>).response !== undefined || (error as AxiosError<ErrorResponse>).request !== undefined;
};

const prisma = new PrismaClient();

// Função para criar uma nova medição
export const createMeasure = async (data: MeasureData) => {
  const { image, customer_code, measure_datetime, measure_type } = data;

  // Valida os dados da medição
  if (!image || !customer_code || !measure_datetime || !measure_type) {
    throw new Error('INVALID_DATA');
  }

  // Converte a string de data para objeto Date e define o intervalo do mês
  const date = new Date(measure_datetime);
  const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  // Verifica se já existe uma medição para o cliente e mês especificado
  const existingMeasure = await prisma.measure.findFirst({
    where: {
      customerCode: customer_code,
      measureDatetime: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
      measureType: measure_type
    }
  });

  if (existingMeasure) {
    throw new Error('DOUBLE_REPORT');
  }

  try {
    // Extrai o valor da imagem usando a API Gemini
    const geminiResponse = await extractMeasureFromImage(image);

    // Cria uma nova medição no banco de dados
    const measure = await prisma.measure.create({
      data: {
        customerCode: customer_code,
        measureDatetime: new Date(measure_datetime),
        measureType: measure_type,
        imageUrl: geminiResponse.image_url,
        measureUuid: geminiResponse.measure_uuid,
        measureValue: geminiResponse.measure_value,
      }
    });

    return measure;
  } catch (error: unknown) {
    // Trata os erros de comunicação com a API Gemini
    if (isAxiosError(error)) {
      if (error.response) {
        const status = error.response.status;  // Status da resposta da API
        const errorMessage = error.response.data?.message || 'Unknown error';  // Mensagem de erro

        // Acessa a URL da requisição de forma segura
        const url = error.config ? error.config.url : 'unknown URL';

        switch (status) {
          case 404:
            throw new Error(`Error communicating with Gemini API: Not Found. URL: ${url}`);
          case 500:
            throw new Error(`Error communicating with Gemini API: Server Error. URL: ${url}`);
          default:
            throw new Error(`Error communicating with Gemini API: ${errorMessage}. URL: ${url}`);
        }
      } else if (error.request) {
        // Se não houve resposta do servidor
        throw new Error('Error communicating with Gemini API: No response from server');
      } else {
        // Para outros tipos de erros
        throw new Error(`Error communicating with Gemini API: ${error.message}`);
      }
    } else if (error instanceof Error) {
      // Para erros não relacionados ao Axios
      throw new Error(`Unexpected error: ${error.message}`);
    } else {
      // Para erros desconhecidos
      throw new Error('An unknown error occurred');
    }
  }
};

// Função para confirmar uma medição existente
export const confirmMeasure = async (measure_uuid: string, confirmed_value: number) => {
  const measure = await prisma.measure.findUnique({
    where: { measureUuid: measure_uuid }
  });

  if (!measure) return 'not_found';  // Medição não encontrada
  if (measure.isConfirmed) return 'already_confirmed';  // Medição já confirmada

  // Atualiza a medição com o valor confirmado e marca como confirmada
  await prisma.measure.update({
    where: { measureUuid: measure_uuid },
    data: { confirmedValue: confirmed_value, isConfirmed: true }
  });

  return 'success';  // Retorna sucesso
};

// Função para listar as medições de um cliente
export const listCustomerMeasures = async (customer_code: string, measure_type?: string) => {
  // Define o critério de busca
  const whereClause: any = { customerCode: customer_code };

  if (measure_type) {
    whereClause.measureType = measure_type.toUpperCase();  // Normaliza o tipo de medição
  }

  // Busca as medições no banco de dados
  const measures = await prisma.measure.findMany({
    where: whereClause
  });

  return measures;
};
