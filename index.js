
const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const fileRoutes = require("./routes/fileRoutes");
const path = require("path");
const multer = require("multer");
const nodemailer=require("nodemailer")
require('dotenv').config();

const app = express();

// Database Connection
const connect=mongoose.connect(process.env.DB_URL)
// check database connected or not
connect.then(()=>{
    console.log("database connected successfully")
})
.catch(()=>{
    console.log("database cannot be connected")
})

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Routes
app.use(authRoutes);
app.use(fileRoutes);

// Start Server
const port=process.env.PORT;
app.listen(port, () => {
    console.log(`Server running on Port: ${port}`);
});
