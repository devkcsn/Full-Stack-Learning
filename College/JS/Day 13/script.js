//type mismatch
//Bug in code

function addNumber(a,b){
    return Number(a)+Number(b);
}
console.log(addNumber(10,"5"));

// ---------------------------------

function concatNumber(a,b){
    return a+b;
}
console.log(concatNumber(10,"5"));


// ---------------------------------

function divNumber(a,b){
    if(b==0){
        return "Can't divide by zero";
    }
    return Number(a)/Number(b);
}
console.log(divNumber(10,"0"));

// ---------------------------------

function mulNumber(a,b){
    return a*b;
}
console.log(mulNumber(10,"5"));

// ----------------------------------

function subNumber(a,b){
    return a-b;
}
console.log(subNumber(10,"5"));


