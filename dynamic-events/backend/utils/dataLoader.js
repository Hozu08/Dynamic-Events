import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Carga el contenido del archivo de contexto de IA
 * @param {string} filename - Nombre del archivo a cargar (por defecto: christmas.txt)
 * @returns {Promise<string>} Contenido del archivo
 */
export const loadDataContext = async (filename = "christmas.txt") => {
  return new Promise((resolve, reject) => {
    const filePath = path.join(__dirname, "../data", filename);
    
    fs.readFile(filePath, "utf-8", (err, data) => {
      if (err) {
        console.error(`Error al leer el archivo ${filename}:`, err);
        reject(err);
        return;
      }
      resolve(data);
    });
  });
};

