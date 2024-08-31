module.exports = {
  // Define o preset que será usado pelo Jest. No caso, estamos usando 'ts-jest' para suporte a TypeScript.
  preset: 'ts-jest',
  
  // Define o ambiente de testes como 'node', o que é apropriado para testes de backend.
  testEnvironment: 'node',

  // Define as extensões de arquivos que o Jest deve considerar. Inclui TypeScript (.ts) e JavaScript (.js).
  moduleFileExtensions: ['ts', 'js'],

  // Configura o transformador para arquivos TypeScript. O 'ts-jest' é responsável por compilar TypeScript para JavaScript durante os testes.
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },

  // Define quais arquivos de teste o Jest deve encontrar. Aqui estamos especificando arquivos com extensão .test.ts ou .test.js dentro de qualquer diretório '__tests__'.
  testMatch: ['**/__tests__/**/*.test.(ts|js)'],

  // Configura arquivos a serem carregados antes dos testes serem executados. Aqui, 'dotenv/config' é usado para carregar variáveis de ambiente.
  setupFiles: ['dotenv/config'],

  // Mapeia módulos para substituir suas implementações reais por mocks durante os testes.
  moduleNameMapper: {
    // Mapeia o módulo '@prisma/client' para um mock localizado em '__mocks__/prisma.ts'.
    '^@prisma/client$': '<rootDir>/__mocks__/prisma.ts',
    
    // Mapeia o módulo 'axios' para um mock localizado em '__mocks__/axios.ts'.
    '^axios$': '<rootDir>/__mocks__/axios.ts',
  }
};
