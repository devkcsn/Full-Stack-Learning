import express from "express.js";
import bcrypt from "bcrypt.js";
import User from "../models/User.js";

const router = express.Router();

//register User
router.post("/register" ,async (req,res) => {
    try {
        const {name, email, password } = req.body;
        const exist = await User.findOne({email});
        if(exist) return res.status(400).json({message: "User already exists"});

        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({name, email, password: hashed});
        res.status(201).json({success: true, user });

    }
    catch(error){
        res.status(201).json({success: false, message: error.message });
    }
});

//Login User
router.post("/login" , async (req,res) => {
    try{
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if (!user) return res.status(400).json({message: "User not found"});
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({message: "Invalid credentials"});

        res.json({success: true, message: "Login successful" , user });
    }
    catch (error) {
        res.status(500).json({success: false , message: error.message });
    }
});

export default router;