
const fs = require("fs");
const path = require("path");
const Folder = require("../models/fileModel");

// Helper function to handle file uploads
// const handleFileUpload = async (req, res, folderName, fileType) => {
//     try {
//         const tempPath = req.file.path; // Temporary file path
//         const uploadDir = path.join(__dirname, `../public/uploads/${folderName}`); // Destination folder
//         const finalPath = path.join(uploadDir, req.file.originalname); // Final file path

//         // Ensure the destination directory exists
//         if (!fs.existsSync(uploadDir)) {
//             fs.mkdirSync(uploadDir, { recursive: true });
//         }

//         // Move the file from temp to the final destination
//         fs.rename(tempPath, finalPath, async (err) => {
//             if (err) {
//                 console.error("Error saving the file:", err);
//                 return res.status(500).send("Error saving the file.");
//             }

//             // Save metadata in MongoDB
//             const file = new File({
//                 originalName: req.file.originalname,
//                 fileType,
//                 filePath: `/uploads/${folderName}/${req.file.originalname}`, // Relative path for access
//             });

//             await file.save(); // Save metadata to MongoDB
//             console.log(`${fileType} uploaded and metadata saved:`, file);
//             return res.redirect("/"); // Redirect to the homepage
//         });
//     } catch (error) {
//         console.error("Error handling file upload:", error);
//         return res.status(500).send("An unexpected error occurred.");
//     }
// };

// // Controllers for specific file types
// exports.uploadImage = (req, res) => handleFileUpload(req, res, "images", "image");
// exports.uploadPDF = (req, res) => handleFileUpload(req, res, "pdfs", "pdf");
// exports.addNote = (req, res) => handleFileUpload(req, res, "notes", "note");

exports.home = async (req, res) => {
    const folders = await Folder.find();
    console.log(folders);
    res.render('home'); // Pass 'folders' as the body content
}
exports.fetchFolders = async (req, res) => {
    const folders = await Folder.find();
    res.json(folders);
}

exports.createFolder = async (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).send('Folder name is required');
    }

    const newFolder = new Folder({ name });
    await newFolder.save();
    res.status(201).send('Folder created');
}