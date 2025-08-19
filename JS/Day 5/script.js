// function abcd() {
//     for(var i =0 ; i< 11 ; i++){
//         console.log(i);
//     }
//     console.log(i);
// }

// abcd();



// [obj, obj2, obj3, obj4]
let obj = {
    Name: "harsh",
    age: 24,
    city: "Patna"
}
for (let key in obj) {
    console.log(key);
}
for (let key in obj) {
    console.log(obj[key]);
}
for (let key in obj) {
    console.log(key, obj[key]);
}
