import axios, { AxiosError } from 'axios';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export interface GeminiResponse {
  image_url: string;
  measure_uuid: string;
  measure_value: number;
}

export const extractMeasureFromImage = async (base64Image: string): Promise<GeminiResponse> => {
  try {
    const response = await axios.post(
      'https://api.gemini.com/v1/vision',
      { image: base64Image },
      {
        headers: {
          'Authorization': `Bearer ${GEMINI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const { response, request, message } = error;
      if (response) {
        const status = response.status;
        const errorMessage = response.data?.message || 'Unknown error';

        switch (status) {
          case 404:
            throw new Error(`Error communicating with Gemini API: Not Found. URL: ${error.config?.url}`);
          case 500:
            throw new Error(`Error communicating with Gemini API: Server Error. URL: ${error.config?.url}`);
          default:
            throw new Error(`Error communicating with Gemini API: ${errorMessage}. URL: ${error.config?.url}`);
        }
      } else if (request) {
        throw new Error('Error communicating with Gemini API: No response from server');
      } else {
        throw new Error(`Error communicating with Gemini API: ${message}`);
      }
    } else if (error instanceof Error) {
      throw new Error(`Unexpected error: ${error.message}`);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
};
