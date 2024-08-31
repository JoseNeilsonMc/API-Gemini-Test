import { createMeasure } from '../src/services/measureService';
import { extractMeasureFromImage } from '../src/services/geminiService';
import prismaMock from '../__mocks__/prisma';
import { jest } from '@jest/globals';
import { describe, it, expect, afterEach } from '@jest/globals';

// Defina o tipo para o retorno do extractMeasureFromImage
interface MeasureData {
  image_url: string;
  measure_uuid: string;
  measure_value: number;
}

// Ajuste o mock da função para usar a assinatura correta
jest.mock('../src/services/geminiService', () => ({
  extractMeasureFromImage: jest.fn() as jest.MockedFunction<(base64Image: string) => Promise<MeasureData>>,
}));

describe('createMeasure', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve lançar um erro se os dados obrigatórios estiverem ausentes', async () => {
    const data = {
      image: '',
      customer_code: '',
      measure_datetime: '',
      measure_type: '',
    };

    await expect(createMeasure(data)).rejects.toThrow('INVALID_DATA');
  });

  it('deve lançar um erro se a medida já existir', async () => {
    prismaMock.measure.findFirst.mockResolvedValueOnce({
      customerCode: '123',
      measureDatetime: new Date(),
      measureType: 'TYPE',
    } as any);

    const data = {
      image: 'base64image',
      customer_code: '123',
      measure_datetime: '2024-08-30T00:00:00Z',
      measure_type: 'TYPE',
    };

    await expect(createMeasure(data)).rejects.toThrow('DOUBLE_REPORT');
  });

  it('deve criar uma medida com sucesso', async () => {
    // Ajuste o retorno do mock para corresponder ao tipo definido
    (extractMeasureFromImage as jest.MockedFunction<typeof extractMeasureFromImage>).mockResolvedValueOnce({
      image_url: 'http://example.com/image.jpg',
      measure_uuid: 'uuid-1234',
      measure_value: 100,
    });

    prismaMock.measure.create.mockResolvedValueOnce({
      id: 1,
      customerCode: '123',
      measureDatetime: new Date(),
      measureType: 'TYPE',
      imageUrl: 'http://example.com/image.jpg',
      measureUuid: 'uuid-1234',
      measureValue: 100,
      confirmedValue: null,
      isConfirmed: false,
    } as any);

    const data = {
      image: 'base64image',
      customer_code: '123',
      measure_datetime: '2024-08-30T00:00:00Z',
      measure_type: 'TYPE',
    };

    const result = await createMeasure(data);
    expect(result).toEqual({
      id: 1,
      customerCode: '123',
      measureDatetime: expect.any(Date),
      measureType: 'TYPE',
      imageUrl: 'http://example.com/image.jpg',
      measureUuid: 'uuid-1234',
      measureValue: 100,
      confirmedValue: null,
      isConfirmed: false,
    });
  });
});
