import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Cria uma nova leitura no banco de dados
export const createReading = async (customerCode: string, measureDatetime: Date, measureType: string, measureValue: number, imageUrl: string, measureUuid: string) => {
  try {
    return await prisma.measure.create({
      data: {
        customerCode,
        measureDatetime,
        measureType: measureType.toUpperCase(), 
        measureValue,
        imageUrl,
        measureUuid
      }
    });
  } catch (error) {
    console.error('Erro ao criar leitura:', error);
    throw new Error('DATABASE_ERROR');
  }
};

// Busca uma leitura por mês para evitar duplicação
export const findReadingByMonth = async (customerCode: string, measureType: string, measureDatetime: Date) => {
  try {
    return await prisma.measure.findFirst({
      where: {
        customerCode,
        measureType: measureType.toUpperCase(), // Normalização do tipo
        measureDatetime: {
          gte: new Date(measureDatetime.getFullYear(), measureDatetime.getMonth(), 1),
          lt: new Date(measureDatetime.getFullYear(), measureDatetime.getMonth() + 1, 1)
        }
      }
    });
  } catch (error) {
    console.error('Erro ao buscar leitura por mês:', error);
    throw new Error('DATABASE_ERROR');
  }
};

// Busca uma leitura por UUID
export const findReadingByUuid = async (measureUuid: string) => {
  try {
    return await prisma.measure.findUnique({
      where: { measureUuid }
    });
  } catch (error) {
    console.error('Erro ao buscar leitura por UUID:', error);
    throw new Error('DATABASE_ERROR');
  }
};

// Atualiza uma leitura existente com o valor confirmado e marca como confirmada
export const updateReading = async (measureUuid: string, confirmedValue: number) => {
  try {
    return await prisma.measure.update({
      where: { measureUuid },
      data: {
        confirmedValue,
        isConfirmed: true
      }
    });
  } catch (error) {
    console.error('Erro ao atualizar leitura:', error);
    throw new Error('DATABASE_ERROR');
  }
};

// Lista leituras por código do cliente e opcionalmente por tipo de medição
export const findReadingsByCustomerCode = async (customerCode: string, measureType?: string) => {
  try {
    return await prisma.measure.findMany({
      where: {
        customerCode,
        ...(measureType && { measureType: measureType.toUpperCase() }) // Normalização do tipo
      }
    });
  } catch (error) {
    console.error('Erro ao listar leituras por código do cliente:', error);
    throw new Error('DATABASE_ERROR');
  }
};
