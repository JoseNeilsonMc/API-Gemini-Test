import { PrismaClient } from '@prisma/client';
import { extractMeasureFromImage } from './geminiService';
import { AxiosError } from 'axios';  

interface MeasureData {
  image: string;
  customer_code: string;
  measure_datetime: string;
  measure_type: string;
}

// Defina uma interface para a resposta de erro esperada
interface ErrorResponse {
  message: string;
}

const isAxiosError = (error: unknown): error is AxiosError<ErrorResponse> => {
  return (error as AxiosError<ErrorResponse>).response !== undefined || (error as AxiosError<ErrorResponse>).request !== undefined;
};

const prisma = new PrismaClient();

export const createMeasure = async (data: MeasureData) => {
  const { image, customer_code, measure_datetime, measure_type } = data;

  // Validate data
  if (!image || !customer_code || !measure_datetime || !measure_type) {
    throw new Error('INVALID_DATA');
  }

  const date = new Date(measure_datetime);
  const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  // Check for existing measure
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
    // Extract value from image using Gemini
    const geminiResponse = await extractMeasureFromImage(image);

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
    if (isAxiosError(error)) {
      if (error.response) {
        const status = error.response.status;
        const errorMessage = error.response.data?.message || 'Unknown error';

        // Access config safely by checking its presence
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
        throw new Error('Error communicating with Gemini API: No response from server');
      } else {
        throw new Error(`Error communicating with Gemini API: ${error.message}`);
      }
    } else if (error instanceof Error) {
      throw new Error(`Unexpected error: ${error.message}`);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
};

export const confirmMeasure = async (measure_uuid: string, confirmed_value: number) => {
  const measure = await prisma.measure.findUnique({
    where: { measureUuid: measure_uuid }
  });

  if (!measure) return 'not_found';
  if (measure.isConfirmed) return 'already_confirmed';

  await prisma.measure.update({
    where: { measureUuid: measure_uuid },
    data: { confirmedValue: confirmed_value, isConfirmed: true }
  });

  return 'success';
};

export const listCustomerMeasures = async (customer_code: string, measure_type?: string) => {
  const whereClause: any = { customerCode: customer_code };

  if (measure_type) {
    whereClause.measureType = measure_type.toUpperCase();
  }

  return await prisma.measure.findMany({
    where: whereClause
  });
};