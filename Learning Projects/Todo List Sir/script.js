let addBtn = document.querySelector(".add");
let deletebtn = document.querySelector(".delete");
let lowerMain = document.querySelector(".lower-main");

addBtn.addEventListener("click", function (e) {
    let modal = document.createElement("div");
    modal.classList.add("modal-container");
    modal.innerHTML = `
                <div class="modal-writing-area" contenteditable>Enter Your Tasks Here!!</div>
                <div class="modal-filter-container">
                    <div class="modal-filter">
                        <div class="modal-filter-color" style="background-color: orange;"></div>
                    </div>
                    <div class="modal-filter">
                        <div class="modal-filter-color" 
                        style="background-color: pink;"></div>
                    </div>
                    <div class="modal-filter">
                        <div class="modal-filter-color" 
                        style="background-color: bisque;"></div>
                    </div>
                    <div class="modal-filter">
                        <div class="modal-filter-color"
                        style="background-color: aqua;"></div>
                    </div>
                </div>
           `;

    lowerMain.append(modal);
});
deletebtn.addEventListener("click", function (e) {
    let modalToDelete = document.querySelector(".modal-container");
    if (modalToDelete) {
        modalToDelete.remove();
    }
});