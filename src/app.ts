import express from "express";
import { PrismaClient } from "@prisma/client";
import { extractMeasureFromImage } from "./services/geminiService"; // Importe sua função aqui

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

// Exemplo de rota para criar uma medida
app.post("/measures", async (req, res) => {
  const {
    customerCode,
    measureDatetime,
    measureType,
    imageUrl,
    measureUuid,
    measureValue,
    confirmedValue,
    isConfirmed,
  } = req.body;

  try {
    const measure = await prisma.measure.create({
      data: {
        customerCode,
        measureDatetime,
        measureType,
        imageUrl,
        measureUuid,
        measureValue,
        confirmedValue,
        isConfirmed,
      },
    });
    res.status(201).json(measure);
  } catch (error) {
    res.status(400).json({ error: "Erro ao criar medida" });
  }
});

// Novo endpoint para testar a função extractMeasureFromImage
app.post("/extract-measure", async (req, res) => {
  const { base64Image } = req.body;

  try {
    if (!base64Image) {
      return res.status(400).json({ error: "Base64 image is required" });
    }
    const result = await extractMeasureFromImage(base64Image);
    res.json(result);
  } catch (error) {
    if (error instanceof Error) {
      // Aqui, `error` é do tipo `Error`
      res.status(500).json({ error: error.message });
    } else {
      // Aqui, `error` não é do tipo `Error`
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
});


export default app;
