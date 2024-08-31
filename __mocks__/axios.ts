import axios, { AxiosError } from 'axios';
import { jest } from '@jest/globals';

// Tipagem do mock do `axios`
const mockAxios = axios as jest.Mocked<typeof axios>;

// Define o comportamento dos métodos HTTP do `axios` como funções mockadas
mockAxios.post = jest.fn() as jest.MockedFunction<typeof axios.post>;
mockAxios.get = jest.fn() as jest.MockedFunction<typeof axios.get>;
mockAxios.put = jest.fn() as jest.MockedFunction<typeof axios.put>;
mockAxios.delete = jest.fn() as jest.MockedFunction<typeof axios.delete>;

// Exporta o mock do `axios`
export default mockAxios;

// Função para verificar se um erro é do tipo `AxiosError`
export const isAxiosError = (error: any): error is AxiosError => {
  return error.isAxiosError || (error.response !== undefined && error.request !== undefined);
};
