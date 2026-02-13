const fs = require('fs');

//Create and write a file
fs.writeFileSync('note.txt' , "Hello, this is full stack class--Thanks");

//Read File 
const data = fs.readFileSync('note.txt' , 'utf-8');
console.log("File Content: " , data);

//Append File --- 

fs.appendFileSync('note.txt' , '\nHi ABC How Are you... and add late.');

//Read again
console.log("Updated Content:" , fs.readFileSync('note.txt' , 'utf-8'));

//Truncate file (delete content after certain size)
fs.truncateSync('note.txt', 39); // Keep only first 35 characters

console.log("Truncated Content:" , fs.readFileSync('note.txt' , 'utf-8'));
