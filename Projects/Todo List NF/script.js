const taskInput = document.getElementById("taskInput"); //Js ko access provide krn eke liye
const addBtn = document.getElementById("addBtn"); //Js ko addbutton ka access dene ke liye
const taskList = document.getElementById("taskList"); //Js ko tasklist ka access dene ke liye

//Local storage save karne ka function---------------
function saveTask() {
  localStorage.setItem("Tasks", taskList.innerHTML);
}
// Page load par tasks load karna
window.addEventListener("load", () => {
  taskList.innerHTML = localStorage.getItem("Tasks") || "";
});

// add button par eventListner lagana
addBtn.addEventListener("click", addTask);

function addTask() {
  const taskText = taskInput.value.trim();

  if (taskText === "") return; // If tasktext is empty then nothing will happen

  //li ke lia hame element create karna hoga
  const li = document.createElement("li");
  li.appendChild(document.createTextNode(taskText));

  //delete button listener se text remove karne ke liye
  const dltBtn = document.createElement("button");
  dltBtn.textContent = "Del";
  dltBtn.addEventListener("click", () => {
    taskList.removeChild(li);
    saveTask();
  });
  //delete button ko click karne par task dom se remove hoga aur local storage update hoga,
  li.appendChild(dltBtn);
  taskList.appendChild(li);

  taskInput.value = ""; // Clear input field
  saveTask();
}

// Add event listener for Enter key on input field
taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addTask();
  }
});

const counterValue = document.getElementById("counterValue");
const incBtn = document.getElementById("incBtn");
const decBtn = document.getElementById("decBtn");
const resetBtn = document.getElementById("resetBtn");

let count = localStorage.getItem("count")?parseInt (localStorage.getItem("count")): 0 ;

counterValue.textContent = count;
incBtn.addEventListener("click", () => {
    count++; 
    counterValue.textContent=count; //update karne ke liye dom me
    localStorage.setItem("count" , count); // save karne ke liye
});
