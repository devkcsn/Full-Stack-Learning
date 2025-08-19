let btnon = document.querySelector("#ON");
let btnoff = document.querySelector("#OFF");

let cont = document.querySelector(".container");
let const2 = document.querySelector(".circle");

btnon.addEventListener("click" , function () { 
    cont.style.backgroundColor = "yellow" ;
    const2.style.backgroundColor = "black" ; 
})

btnoff.addEventListener("click" , function () { 
    cont.style.backgroundColor = "black" ;
    const2.style.backgroundColor = "yellow" ; 
})

btnon.addEventListener("dblclick" , function () { 
    cont.style.backgroundColor = "red" ;
    const2.style.backgroundColor = "white" ; 
})

btnon.addEventListener("mouseover" , function () { 
    cont.style.backgroundColor = "blue" ;
    const2.style.backgroundColor = "white" ; 
})
btnon.addEventListener("mouseout" , function () { 
    cont.style.backgroundColor = "black" ;
    const2.style.backgroundColor = "yellow" ; 
})