let expenses = [];
let totalExpenses = 0;
let salary = 0;
let expenseNameInput = document.getElementById('expense-name');
let amountInput = document.getElementById('amount');
let categorySelect = document.getElementById('Category');
let submitButton = document.getElementById('submit');
let expenseList = document.getElementById('expense-list');
let clearDataButton = document.getElementById('clear-data');
let totalExpensesDisplay = document.querySelector('.total-expenses .amount');
let salaryDisplay = document.querySelector('.Salary .amount');
let salaryBox = document.querySelector('.Salary');

salaryDisplay.innerHTML = '₹0 (Click to edit)';

salaryBox.onclick = function () {
    var newSalary = prompt("Enter your monthly salary:");
    if (newSalary && newSalary > 0) {
        salary = Number(newSalary);
        salaryDisplay.innerHTML = '₹' + salary;
        updateTotal();
    }
};


function addExpense() {
    var expenseName = expenseNameInput.value;
    var amount = Number(amountInput.value);
    var category = categorySelect.value;
    if (expenseName == '' || amount == 0) {
        alert('Please fill all fields!');
        return;
    }

    var newExpense = {
        name: expenseName,
        amount: amount,
        category: category
    };


    expenses.push(newExpense);


    totalExpenses = totalExpenses + amount;


    showExpenses();


    updateTotal();

    expenseNameInput.value = '';
    amountInput.value = '';
    categorySelect.value = 'food';
}

function showExpenses() {
    var html = '';

    for (var i = 0; i < expenses.length; i++) {
        html += '<div style="background: rgba(255,255,255,0.1); margin: 10px 0; padding: 15px; border-radius: 8px;">';
        html += '<div style="display: flex; justify-content: space-between;">';
        html += '<div>';
        html += '<strong style="color: white;">' + expenses[i].name + '</strong>';
        html += '<div style="color: #ccc;">' + expenses[i].category + '</div>';
        html += '</div>';
        html += '<div style="color: #ff6b6b; font-weight: bold;">₹' + expenses[i].amount + '</div>';
        html += '</div>';
        html += '</div>';
    }

    expenseList.innerHTML = html;
}

function updateTotal() {
    totalExpensesDisplay.innerHTML = '₹' + totalExpenses;
}

function clearAllData() {
    if (confirm('Are you sure you want to clear all data?')) {
        expenses = [];
        totalExpenses = 0;
        salary = 0;

        showExpenses();
        updateTotal();
        salaryDisplay.innerHTML = '₹0 (Click to edit)';
    }
}

submitButton.onclick = function (event) {
    event.preventDefault();
    addExpense();
};

clearDataButton.onclick = function () {
    clearAllData();
};