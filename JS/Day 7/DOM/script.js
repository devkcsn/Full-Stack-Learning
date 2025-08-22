let btn = document.querySelector("button");
let cont = document.querySelector(".container");

btn.addEventListener("click" , function () {
    cont.style.backgroundColor = "green" ;
    cont.innerText = "Hi I am DOM manipulator"
})
btn.addEventListener("dblclick" , function () {
    cont.style.backgroundColor = "red" ;
    cont.innerText = "Styled on double click"
})