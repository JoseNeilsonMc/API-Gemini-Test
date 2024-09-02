import nock from "nock";
import request from "supertest";
import app from "../src/app";

describe("Teste de Gemini Service", () => {
  beforeEach(() => {
    // Configura o nock para interceptar e simular a resposta da API Gemini
    nock("https://api.gemini.com").post("/v1/vision").reply(200, {
      image_url: "http://example.com/image.jpg",
      measure_uuid: "uuid-1234",
      measure_value: 100,
    });
  });

  it("deve retornar os dados da medida com sucesso", async () => {
    const base64Image = "fakeBase64Image";

    const response = await request(app)
      .post("/extract-measure")
      .send({ base64Image });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("image_url");
    expect(response.body).toHaveProperty("measure_uuid");
    expect(response.body).toHaveProperty("measure_value");
  });

  it("deve retornar um erro se a imagem base64 estiver faltando", async () => {
    const response = await request(app).post("/extract-measure").send({});

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });
});
