const express = require('express');
const router = express.Router();

router.get('/' , (req,res) => {
    res.send('Welcome to user home page')
} );

router.get('./login' , (req,res) => {
    res.send('user login page')
});

router.get('./Registration' , (req,res) => {
    res.send('user registration page')
});
