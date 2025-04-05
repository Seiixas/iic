import fs from "fs";
import "dotenv/config";

import { GenerativeModel, GoogleGenerativeAI } from "@google/generative-ai";
import { promisify } from "util";

type ExtractDataFromImageResponse = {
  estabelecimento: string;
  data: string;
  itens: Array<{
    item: string;
    quantidade: number;
    preco: number;
  }>;
  valor_total: number;
  acuracia: string;
  precisao: string;
};

class GoogleGenerativeAILib {
  private instance: GoogleGenerativeAI;
  private model: GenerativeModel;

  constructor() {
    this.instance = new GoogleGenerativeAI(
      process.env.GEMINI_API_KEY as string
    );
    this.model = this.instance.getGenerativeModel({
      model: "gemini-1.5-flash",
    });
  }

  async extractDataFromImage(
    image: Express.Multer.File
  ): Promise<ExtractDataFromImageResponse> {
    const prompt =
      "Extraia as informações relevantes deste documento, incluindo itens, quantidades, preços, valor total, data e nome do estabelecimento.\n" +
      "Formato de saída: JSON.\n" +
      'Exemplo de saída: {"estabelecimento": "Nome do Estabelecimento", "data": "2023-10-01", "itens": [{"item": "Produto 1", "quantidade": 2, "preco": 10.0}, {"item": "Produto 2", "quantidade": 1, "preco": 20.0}], "valor_total": 40.0, "acuracia": "100%", "precisao": "50%"}' +
      "Se não houver informações relevantes, retorne uma mensagem indicando que não foram encontradas informações relevantes." +
      "A acurácia e precisão devem ser dados do modelo Gemini ao analisar a imagem e não dados mockados: 50% 100%" +
      "Não retorne dados a mais nesse JSON, apenas a formatação exigida acima, pois posso ter erro de integração com o sistema." +
      "Não retorne informações adicionais, apenas o JSON formatado corretamente." +
      "Retorne apenas o texto, sem formatação adicional, como HTML ou Markdown. Sem o ```json```, pois irei utilizar o JSON.parse() para transformar em objeto.";

    const fileBuffer = fs.readFileSync(image.path);

    const imageData = {
      inlineData: {
        data: fileBuffer.toString("base64"),
        mimeType: image.mimetype,
      },
    };

    const result = await this.model.generateContent([prompt, imageData]);
    const response = result.response.text();

    promisify(fs.unlink)(image.path);

    return JSON.parse(response) as ExtractDataFromImageResponse;
  }
}

export { GoogleGenerativeAILib };
