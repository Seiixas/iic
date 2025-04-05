import multer from "multer";

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = file.originalname.split(".").pop();
    const newFilename = `${uniqueSuffix}.${extension}`;
    cb(null, newFilename);
  },
});

const fileFilterMiddleware = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedExtensions = ["png", "jpg", "jpeg"];
  const extension = file.originalname.split(".").pop()?.toLowerCase();

  if (extension && allowedExtensions.includes(extension)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Formato de imagem inválido. Apenas PNG, JPG e JPEG são permitidos."
      )
    );
  }
};

const upload = multer({
  storage,
  fileFilter: fileFilterMiddleware as any,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export { upload };
