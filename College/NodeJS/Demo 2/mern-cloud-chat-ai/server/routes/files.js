import express from "express";
import multer from "multer";
import File from "../models/File.js";
import path from "path" ;

const router = express.Router();

const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => cb(null , Date.now() + "-" + file.originalname),
});

const upload = multer({storage});

//Upload file 
router.post("/upload" , upload.single("file"), async(req,res) => {
    try {
        const newFile = await File.create({
            filename: req.file.originalname,
            filepath: req.file.path,
        });
        res.json({success: true, file: newFile});
    }
    catch(error) {
    res.status(500).json({success: false, message: error.message});
    }
});

//Get all files

router.get("/" , async (req,res) => {
    try{
        const files = await File.find().sort({createdAt: -1});
        res.json(files);
    }
    catch(error) {
        res.status(500).json({messages: error.messaeg });
    }
});

export default router;