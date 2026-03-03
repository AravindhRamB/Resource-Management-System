/**
 * ==========================================================
 * File        : fileHandler.js
 * Author      : Aravindh Ram
 * Created On  : 
 * Description : Controller to handle file uploads and management
 * ==========================================================
 */
const path = require("path");
const fs = require("fs");

// Directory to store uploaded files
const UPLOAD_DIR = path.join(process.cwd(), "uploads", "claims");

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// Save uploaded file and return file metadata
function saveUploadedFile(file, expenseId) {
  if (!file) {
    throw new Error('File object is required');
  }

  try {
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    const fileName = `${baseName}_${Date.now()}${ext}`;
    const fullPath = path.join(UPLOAD_DIR, fileName);

    // If file stored in memory (buffer available)
    if (file.buffer) {
      fs.writeFileSync(fullPath, file.buffer);
    }
    // If file saved by Multer to a temp path (diskStorage)
    else if (file.path) {
      fs.copyFileSync(file.path, fullPath);
    } else {
      throw new Error('File object has no buffer or path');
    }

    const relativePath = path.join("uploads", "claims", fileName).replace(/\\/g, "/");

    return {
      expenseId: expenseId || null,
      filePath: relativePath,
      fileName,
      fileType: file.mimetype || "application/octet-stream"
    };
  } catch (err) {
    err.name = 'FileSaveError';
    throw err;
  }
}

module.exports = { saveUploadedFile };
