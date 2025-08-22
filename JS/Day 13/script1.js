//Logic error bug

// Buggy version:
// function isEven(num){
//     if(num%2==1){  //equality needs to be equal to 0
//         return true;
//     }
//     return false;
// }
// console.log(isEven(4));

// Fixed version:
// function isEven(num){
//     if(num%2==0){  //should check if remainder is 0 for even numbers
//         return true;
//     }
//     return false;
// }
// console.log(isEven(4)); // Should return true


// Buggy version - Array index out of bounds:
// let arr=[1,2,38];
// if(5 < arr.length){
//     console.log(arr[5].toString());
// } else {
//     console.log("Index out of bounds");
// }

// Fixed version:
// let arr=[1,2,38];
// if(5 < arr.length){
//     console.log(arr[5].toString());
// } else {
//     console.log("Index out of bounds");
// }

// ----------------------------------

// Buggy version - wrong variable name used:
// let arr1=[1,2,38];
// if(arr[5] !== undefined){
//     console.log(arr[5].toString());
// } else {
//     console.log("undefined");
// }

// Fixed version:
// let arr1=[1,2,38];
// if(arr1[5] !== undefined){
//     console.log(arr1[5].toString());
// } else {
//     console.log("undefined");
// }

let obj=null;
if(obj !== null && obj.value !== null){
    console.log(obj.name);
}
else{
    console.log("Value is null")
}



