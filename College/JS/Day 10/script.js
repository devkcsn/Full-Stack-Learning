

function displayInputValue() {
    let imp = document.querySelector(".newlist");
    let ul = document.querySelector("ul");
    let btn = document.querySelector(".button");

    btn.addEventListener("click", function() {
        if(imp.value == "" || imp.value() == " z") {
            alert("Please enter a task");
            return;
        } else {
            let li = document.createElement("li");
            li.innerHTML = `${imp.value}`;
            ul.append(li);
            imp.value = "";
        }
    })
}

// Call the function to initialize the event listener
displayInputValue();