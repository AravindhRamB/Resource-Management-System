/**
 * ==========================================================
 * File        : fileSaver.js
 * Author      : Aravindh Ram
 * Created On  : 
 * Description : Utility to save uploaded files to the server
 * ==========================================================
 */
const path = require("path");
const fs = require("fs");

// Directory to save uploaded files
const UPLOAD_DIR = path.join(process.cwd(), "uploads", "emp_docs");

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// Save uploaded file and return its details
function saveUploadedFile(file, empId) {
  if (!file) {
    throw new Error('File object is required');
  }

  if (!empId) {
    throw new Error('Employee ID is required');
  }

  try {
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    const fileName = `${empId}_${baseName}_${Date.now()}${ext}`;
    const fullPath = path.join(UPLOAD_DIR, fileName);

    if (!file.buffer) {
      throw new Error('File buffer is missing');
    }

    fs.writeFileSync(fullPath, file.buffer);

    const relativePath = path.join("uploads", "emp_docs", fileName).replace(/\\/g, "/");

    return {
      filePath: relativePath,
      fileName,
      fileType: file.mimetype,
    };
  } catch (err) {
    err.name = 'FileSaveError';
    throw err;
  }
}

module.exports = { saveUploadedFile };
