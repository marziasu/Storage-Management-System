
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fileController = require("../controllers/fileController");

// Configure multer for temp uploads
const upload = multer({ dest: path.join(__dirname, "../public/uploads/temp") });

// home
router.get('/home', fileController.home);

// API to fetch all folders
router.get('/api/folders', fileController.fetchFolders);
  
  // API to create a new folder
router.post('/api/folders', fileController.createFolder);


// Routes for uploading
// router.post("/upload-image", upload.single("file"), fileController.uploadImage);
// router.post("/upload-pdf", upload.single("file"), fileController.uploadPDF);
// router.post("/add-note", upload.single("file"), fileController.addNote);

// router.post("/create-folder", fileController.createFolder);

module.exports = router;


