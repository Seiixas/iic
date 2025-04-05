import { GoogleGenerativeAILib } from "../../libs/google-generative-ai.lib";

const googleGenerativeAIService = new GoogleGenerativeAILib();

export async function analyzeImageController(req: any, res: any) {
  const invoice = req.file;

  if (!invoice) {
    return res.status(400).json({
      message: "Nenhum arquivo enviado ou formato inválido.",
      error:
        "Formato de imagem inválido. Apenas PNG, JPG e JPEG são permitidos.",
    });
  }

  try {
    const analysis = await googleGenerativeAIService.extractDataFromImage(
      invoice
    );
    return res.status(200).json(analysis);
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao processar a imagem",
      error: error instanceof Error ? error.message : "Erro desconhecido",
    });
  }
}
