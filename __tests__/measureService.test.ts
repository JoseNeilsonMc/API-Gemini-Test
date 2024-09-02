import request from "supertest";
import app from "../src/app"; // Aponte para o arquivo onde sua instância do app é exportada
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("Testes de API - /measures", () => {
  beforeEach(async () => {
    await prisma.measure.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("deve criar uma medida com sucesso", async () => {
    const response = await request(app).post("/measures").send({
      customerCode: "123",
      measureDatetime: new Date().toISOString(),
      measureType: "TYPE",
      imageUrl: "http://example.com/image.jpg",
      measureUuid: "uuid-1234",
      measureValue: 100,
      confirmedValue: null,
      isConfirmed: false,
    });

    expect(response.status).toBe(201); // Verificando status
    expect(response.body).toHaveProperty("id"); // Verificando se a resposta contém a propriedade 'id'
    expect(response.body.customerCode).toBe("123"); // Verificando se o valor está correto
  });

  it("deve lançar um erro se faltar dados obrigatórios", async () => {
    const response = await request(app).post("/measures").send({
      measureDatetime: new Date().toISOString(),
      measureType: "TYPE",
      imageUrl: "http://example.com/image.jpg",
    });

    expect(response.status).toBe(400); // Verificando status de erro
    expect(response.body).toHaveProperty("error"); // Verificando se há uma mensagem de erro
  });
});
