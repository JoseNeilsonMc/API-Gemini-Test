// Importa o `PrismaClient` da biblioteca `@prisma/client`
// Importa a função `jest` para criar mocks do Prisma Client
import { PrismaClient } from '@prisma/client';
import { jest } from '@jest/globals';

// Cria um mock do Prisma Client
// O `prismaMock` define mocks para os métodos usados do Prisma Client, permitindo testar o comportamento sem interagir com um banco de dados real
const prismaMock = {
  measure: {
    // Define os métodos do modelo `measure` como funções mockadas
    create: jest.fn(),
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
} as unknown as jest.Mocked<PrismaClient>;

// Exporta o mock do Prisma Client para ser usado em outros arquivos de teste
export default prismaMock;
