import multer from "multer";
import path from "path";
import fs from "fs";

const storeFile = (uploadFile, uploadPath, fileType, isRequired = false) => {
  // If not available, create the folder
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  // Configure where to store and how to name uploaded files
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadPath); // folder to save uploaded files
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    },
  });

  // File filter to allow images only
  const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith(fileType) || !isRequired) {
      cb(null, true);
    } else {
      cb(new Error(`Only ${fileType} files are allowed!`), false);
    }
  };

  const upload = multer({ storage, fileFilter }).single(uploadFile);

  return upload;
};

const storeMultipleFile = (uploadFile, uploadPath, fileType, isRequired = false, maxCount = 10) => {
  // If not available, create the folder
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  // Configure where to store and how to name uploaded files
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadPath); // folder to save uploaded files
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    },
  });

  // File filter to allow images only
  const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith(fileType) || !isRequired) {
      cb(null, true);
    } else {
      cb(new Error(`Only ${fileType} files are allowed!`), false);
    }
  };

  const upload = multer({ storage, fileFilter }).array(uploadFile, maxCount);

  return upload;
};

export { storeFile, storeMultipleFile };
export default storeFile;
