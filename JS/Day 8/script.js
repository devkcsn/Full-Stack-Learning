let likebtn = document.querySelector("#like");
let floatingLike = document.querySelector("#floating-like")
let post = document.querySelector(".middle-box");
let clicked = "OFF";

likebtn.addEventListener("click", function () {
    if(clicked == "OFF"){
        likebtn.className = "ri-heart-3-fill";
        likebtn.style.color = "red";
        clicked = "ON";
    }
    else if(clicked == "ON"){   
        likebtn.className = "ri-heart-3-line";
        likebtn.style.color = "black";
        clicked = "OFF";
    }
})

post.addEventListener("dblclick", function () {

    likebtn.className = "ri-heart-3-fill";
    likebtn.style.color = "red";
    clicked = "ON";
    
    floatingLike.style.opacity = "0.8";
    floatingLike.style.transform = "translate(-50%, -50%) scale(1.2)";
    
    setTimeout(() => {
        floatingLike.style.opacity = "0";
        floatingLike.style.transform = "translate(-50%, -50%) scale(1)";
    }, 600);
})