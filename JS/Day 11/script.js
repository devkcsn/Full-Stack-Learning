let parent = document.querySelector(".box");
let btn = document.querySelector("button");

btn.addEventListener("click", function () {
    let newDiv = document.createElement("div");
    let newDiv1 = document.createElement("div");
    let newDiv2 = document.createElement("div");
    let newDiv3 = document.createElement("div");
    const newDiv4 = document.createElement("div");

    newDiv4.textContent = "Hello World!";
    

    
    newDiv.classList.add("child");
    newDiv1.classList.add("child1");
    newDiv2.classList.add("child2");
    newDiv3.classList.add("child3");
    newDiv4.classList.add("my-class");


    parent.appendChild(newDiv);
    parent.appendChild(newDiv1);
    parent.appendChild(newDiv2);
    parent.appendChild(newDiv3);
    parent.appendChild(newDiv4);
    btn.disabled = true;
})
