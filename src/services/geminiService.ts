import axios from 'axios';

// Obtém a chave da API do ambiente
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Interface para o tipo de resposta que esperamos da API Gemini
export interface GeminiResponse {
  image_url: string;
  measure_uuid: string;
  measure_value: number;
}

// Função assíncrona para extrair medidas de uma imagem base64 usando a API Gemini
export const extractMeasureFromImage = async (base64Image: string): Promise<GeminiResponse> => {
  try {
    // Envia uma solicitação POST para a API Gemini com a imagem codificada em base64
    const response = await axios.post(
      'https://api.gemini.com/v1/vision',
      { image: base64Image },
      {
        headers: {
          'Authorization': `Bearer ${GEMINI_API_KEY}`,  // Inclui a chave da API no cabeçalho de autorização
          'Content-Type': 'application/json',  // Define o tipo de conteúdo como JSON
        },
      }
    );
    // Retorna os dados da resposta da API
    return response.data;
  } catch (error) {
    // Trata os erros que ocorrem durante a requisição
    if (axios.isAxiosError(error)) {
      const { response, request, message } = error;
      if (response) {
        const status = response.status;  // Status da resposta da API
        const errorMessage = response.data?.message || 'Unknown error';  // Mensagem de erro da resposta, se disponível

        // Trata diferentes códigos de status HTTP
        switch (status) {
          case 404:
            throw new Error(`Error communicating with Gemini API: Not Found. URL: ${error.config?.url}`);
          case 500:
            throw new Error(`Error communicating with Gemini API: Server Error. URL: ${error.config?.url}`);
          default:
            throw new Error(`Error communicating with Gemini API: ${errorMessage}. URL: ${error.config?.url}`);
        }
      } else if (request) {
        // Se não houve resposta do servidor
        throw new Error('Error communicating with Gemini API: No response from server');
      } else {
        // Para outros tipos de erros
        throw new Error(`Error communicating with Gemini API: ${message}`);
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
