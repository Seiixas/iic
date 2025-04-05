import express from "express";
import path from "path";

import { upload } from "./config/upload";
import { analyzeImageController } from "./controllers/analyze-image.controller";

const app = express();

app.use(express.static(path.join(__dirname, "../../public")));

app.post("/analyze-image", upload.single("invoice"), analyzeImageController);

app.listen(process.env.PORT!);
