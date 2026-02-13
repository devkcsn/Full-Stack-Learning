// //import express
// const express = require("express");

// //create app
// const app = express();

// //create route
// app.get('/' , (req,res) => {
//     res.send('Hello with Nodemon thanks');
// });

// //start server
// app.listen(3008,()=> {
//     console.log('Server running on http://localhost:3008')
// });

const express = require("express");
const app = express();

const userRoutes = require('./routes/userRoutes');

app.use('./users', userRoutes);

app.use('./users',userRoutes);

app.get('/',(req,res) => {
    res.send("Welcome to my home page");
});

app.listen(3000,() => {
    console.log('server running on http://localhost:3000');
});