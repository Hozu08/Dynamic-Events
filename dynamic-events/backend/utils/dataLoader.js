import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Mapeo de temas a archivos de contexto
 */
const themeFiles = {
  christmas: 'christmas.txt',
  halloween: 'halloween.txt',
  vacation: 'vacation.txt',
};

/**
 * Carga el contenido del archivo de contexto de IA
 * @param {string} theme - Tema seleccionado (christmas, halloween, vacation)
 * @returns {Promise<string>} Contenido del archivo
 */
export const loadDataContext = async (theme = "christmas") => {
  return new Promise((resolve, reject) => {
    const filename = themeFiles[theme] || themeFiles.christmas;
    const filePath = path.join(__dirname, "../data", filename);
    
    fs.readFile(filePath, "utf-8", (err, data) => {
      if (err) {
        console.error(`Error al leer el archivo ${filename}:`, err);
        // Si falla, intentar con christmas.txt como fallback
        if (theme !== 'christmas') {
          const fallbackPath = path.join(__dirname, "../data", themeFiles.christmas);
          fs.readFile(fallbackPath, "utf-8", (fallbackErr, fallbackData) => {
            if (fallbackErr) {
              reject(fallbackErr);
              return;
            }
            console.warn(`Usando archivo de contexto por defecto (christmas.txt)`);
            resolve(fallbackData);
          });
          return;
        }
        reject(err);
        return;
      }
      resolve(data);
    });
  });
};

