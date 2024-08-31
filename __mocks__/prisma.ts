import { PrismaClient } from '@prisma/client';
import { jest } from '@jest/globals';

const prismaMock = {
  measure: {
    create: jest.fn(),
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
} as unknown as jest.Mocked<PrismaClient>;

export default prismaMock;
