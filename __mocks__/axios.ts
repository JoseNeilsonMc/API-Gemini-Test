import axios, { AxiosResponse, AxiosError } from 'axios';
import { jest } from '@jest/globals';

// Tipar o mock do axios
const mockAxios = axios as jest.Mocked<typeof axios>;

// Definir o comportamento dos métodos do axios
mockAxios.post = jest.fn() as jest.MockedFunction<typeof axios.post>;
mockAxios.get = jest.fn() as jest.MockedFunction<typeof axios.get>;
mockAxios.put = jest.fn() as jest.MockedFunction<typeof axios.put>;
mockAxios.delete = jest.fn() as jest.MockedFunction<typeof axios.delete>;

// Exportar o mock como uma exportação padrão
export default mockAxios;

// Exportar uma função para verificar se um erro é do tipo AxiosError
export const isAxiosError = (error: any): error is AxiosError => {
  return axios.isAxiosError(error);
};
