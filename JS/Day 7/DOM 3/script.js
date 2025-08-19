let btnon = document.querySelector("#ON");
let cont = document.querySelector(".container");
let const2 = document.querySelector(".circle");

// ------------------ METHOD 1 --------------------------

// let clickCount = 0;

// btnon.addEventListener("click" , function () { 
//    clickCount += 1;
   
//    if(clickCount % 2 != 0){
//        cont.style.backgroundColor = "yellow";
//        const2.style.backgroundColor = "black";
//    }
//    else if(clickCount % 2 == 0){
//        cont.style.backgroundColor = "black";
//        const2.style.backgroundColor = "yellow";
//    }
// })

// ------------------- METHOD 2 ----------------------------

// btnon.addEventListener("click" , function () { cont.style.backgroundColor = "yellow";
//        const2.style.backgroundColor = "black";} )

// btnon.addEventListener("dblclick" , function () { 
//           cont.style.backgroundColor = "black";
//        const2.style.backgroundColor = "yellow";
// }
// )

// ------------------------ METHOD 3 -------------------------

let clicked = "OFF" ;

btnon.addEventListener("click" , function () { 
   

   if(clicked == "ON"){
       cont.style.backgroundColor = "yellow";
       const2.style.backgroundColor = "black";
       clicked = "OFF" ; 
   }
   else if(clicked == "OFF"){
       cont.style.backgroundColor = "black";
       const2.style.backgroundColor = "yellow";
       clicked = "ON" ;
   }
})