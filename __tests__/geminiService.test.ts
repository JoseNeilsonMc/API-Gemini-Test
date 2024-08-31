import axios, { AxiosError } from 'axios';
import { extractMeasureFromImage, GeminiResponse } from '../src/services/geminiService';
import mockAxios, { isAxiosError } from '../__mocks__/axios';
import { describe, it, expect, afterEach } from '@jest/globals';
import { jest } from '@jest/globals';

// Cria um mock para o módulo `axios`
jest.mock('axios');

// Tipar o mock do axios
const mockedAxios = mockAxios as jest.Mocked<typeof axios>;

describe('extractMeasureFromImage', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve retornar a resposta esperada quando a chamada for bem-sucedida', async () => {
    const mockResponse: { data: GeminiResponse } = {
      data: {
        image_url: 'http://example.com/image.jpg',
        measure_uuid: '12345',
        measure_value: 10
      }
    };

    mockedAxios.post.mockResolvedValue(mockResponse);

    const result = await extractMeasureFromImage('base64ImageString');
    expect(result).toEqual(mockResponse.data);
  });

  it('deve lançar um erro com status 404', async () => {
    const mockError: AxiosError = {
      response: {
        status: 404,
        data: { message: 'Not Found' }
      }
    } as any;

    mockedAxios.post.mockRejectedValue(mockError);

    await expect(extractMeasureFromImage('base64ImageString')).rejects.toThrow('Error communicating with Gemini API: Not Found. URL: unknown URL');
  });

  it('deve lançar um erro com status 500', async () => {
    const mockError: AxiosError = {
      response: {
        status: 500,
        data: { message: 'Server Error' }
      }
    } as any;

    mockedAxios.post.mockRejectedValue(mockError);

    await expect(extractMeasureFromImage('base64ImageString')).rejects.toThrow('Error communicating with Gemini API: Server Error. URL: unknown URL');
  });

  it('deve lançar um erro quando não houver resposta', async () => {
    const mockError: AxiosError = {
      request: {}
    } as any;

    mockedAxios.post.mockRejectedValue(mockError);

    await expect(extractMeasureFromImage('base64ImageString')).rejects.toThrow('Error communicating with Gemini API: No response from server');
  });

  it('deve lançar um erro inesperado', async () => {
    const mockError = new Error('Unexpected error');

    mockedAxios.post.mockRejectedValue(mockError);

    await expect(extractMeasureFromImage('base64ImageString')).rejects.toThrow('Error communicating with Gemini API: Unexpected error');
  });
});
