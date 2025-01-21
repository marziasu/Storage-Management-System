const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    name: String,
    type: String, // e.g. 'image', 'pdf', 'note'
    path: String,
    folderId: mongoose.Schema.Types.ObjectId
});
const File = mongoose.model('File', fileSchema);
module.exports = File;

const folderSchema = new mongoose.Schema({
    name: String,
    files: [fileSchema]
});

const Folder = mongoose.model('Folder', folderSchema);
module.exports = Folder;


