// To Do List App

// JAb Hum dom se element get karne ho to ab( DOM api method ke through karte hai)

const taskInput = document.getElementById("taskInput"); //Input box
const addBtn = document.getElementById("addBtn"); //Add Task
const taskList = document.getElementById("taskList"); //Ul list

// Ab local storage me task save karne ka function---

function savetask() {
  localStorage.setItem("task", taskList.innerHTML); // Ul ka pura HTML string save karne ke liye.
}

//Page load hote hi load ke
window.addEventListener("load", () => {
  taskList.innerHTML = localStorage.getItem("task") || "";
  //reload ke baad deletebutton bhi kaam kare eske liye har button pe listener add karna
});
const allDelBtn = document.querySelectorAll("#taskList button");
allDelBtn.forEach((btn) => {
  btn.addEventListener("click", () => {
    btn.parentElement.remove(); //parent <li> delete
    saveTasks(); //local storage update ke liye
  });
});

//Add button par click event listner
const taskText = taskInput.ariaValueMax.trim(); //input +878
if (taskTask == "") return;
