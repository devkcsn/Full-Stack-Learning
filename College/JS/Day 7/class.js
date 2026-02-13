// ---------------------------------------------------------- IF ELSE QUESTION

// let input = 10;
// function counting(input ) {
//     count = 0;
// for(let i = 0 ; i< input ; i++){
//     if(i%2!= 0 ){
//        (count += i);
//     }
// }
// console.log(count);}

// counting(input);

// -------------------------------------------------------- // Copying an array into another array.

// let arr= [1,2,3,4,5,6]
// let brr = arr ; 
// console.log(brr); // This will not work for copying as it take arr as refence any changes in arr make changes in brr.

// ---------- METHOD 1 ----------------- FOR LOOP

// arr = [1,2,3,4,5];
// let brr = [];

// for(let i = 0; i < arr.length; i++){
//     brr[i] = arr[i]; 
// }
// console.log(brr);

// ----------- METHOD 2 ------------- SPREAD
// let arr = [1,2,3,4,5] ; 
// let brr = [...arr] ; 
// brr.pop();
// arr.pop();
// arr.pop();
// console.log(arr);
// console.log(brr);

// ------------ METHOD 3 ------------- MAPPING

// let arr = [1,2,3,4,5];
// let brr = arr.map(function(e){
//     return e;
// })
// arr.pop();
//  console.log(arr);
//  console.log(brr);

// ------ Changes in method 3 ------

// let arr = [1,2,3,4,5];
// let brr = arr.map(function(e){
//     return e+2;
// })
// console.log(brr);

// ---------------------------------

// let arr = [1,2,55,4,8,,5646,8,1532165,411,21,21549,1211,54,32,51]

// let evenArr = arr.filter(function(elem) {
//     return (elem % 2 == 0);
// })
// let oddArr = arr.filter(function(elem){
//     return (elem % 2 !== 0);
// })
// console.log(evenArr);

// -------------- typeof -------------------

// let example = [1,15498,51,654,981,23165,41,0,"Amit" , 1.1];

// console.log(typeof example );
// console.log(example);

// ------------- REVERSE OF ARRAY ----------------

// let arr = [1,2,3,4,5,6];

// let brr = arr.reverse();
//     console.log(brr);

// ---------- USING LOOP -------

// let arr = [1,2,3,4,5];
// let brr = [];
// for(let i = arr.length - 1 , j = 0 ; i >= 0 ; i-- , j++){

//     brr[j] = arr[i]; 
// }
// console.log(brr);

// ------------ SUM OF ALL ELEMENTS IN AN ARRAY -----------------

// let arr = [121,5,651,23,1,51,322,1652]
// sum = 0
// for(let i = 0 ; i < arr.length ; i++){
//     sum += arr[i];
// }
// console.log(sum);

// ---------------- REVERSE A STRING --------------------

// let arr = "AMIT KUMAR"

// let brr = [];
// for(let i = arr.length - 1 , j = 0 ; i >= 0 ; i-- , j++){

//     brr[j] = arr[i]; 
// }
// console.log(brr);
// console.log(brr.join());
// console.log(brr.join(" "));


// --------------- FIND DUPLICATE IN ARRAY ------------------- WRONG

// let arr = [2155,51,5,5,1,1,52,1566,41,5,4];
// let brr = [];

// brr[0] = arr[0]
// for (let i = 0; i < arr.length ; i++){
//     for(let j = 0 ; j < arr.length ; j++){
//         if(arr[i] != brr[j]){
//             brr[i] = arr[i]
//         }
//     }
    
// }


// ----------------- Array manipulation ---------------------------
// let arr = [1,2,3,4,5,6,7,8,9];
// arr.pop();
// console.log(arr);
// arr.shift();
// console.log(arr);
// arr.push(6);
// console.log(arr);
// arr.unshift(8);
// console.log(arr);
