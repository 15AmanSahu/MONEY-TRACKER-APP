let expenses = [];
let totalAmount = 0;
const categorySelect = document.getElementById('category_select');
const amountInput = document.getElementById('amount_input');
const infoInput = document.getElementById('info');
const dateInput = document.getElementById('date_input');
const expenseTableBody = document.getElementById('expense-table-body');
const totalAmountCell = document.getElementById('total-amount');

document.getElementById('expense-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const category = categorySelect.value;
    const info = infoInput.value;
    const amount = Number(amountInput.value);
    const date = dateInput.value;

    if (category === '') {
        alert('Please select a category');
        return;
    }
    if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount');
        return;
    }
    if (date === '') {
        alert('Please select a date');
        return;
    }

    expenses.push({ category, amount, info, date });

    if (category === 'Income') {
        totalAmount += amount;
    } else if (category === 'Expense') {
        totalAmount = amount;
    }

    totalAmountCell.textContent = totalAmount;

    const newRow = expenseTableBody.insertRow();

    const categoryCell = newRow.insertCell();
    const amountCell = newRow.insertCell();
    const infoCell = newRow.insertCell();
    const dateCell = newRow.insertCell();
    const deleteCell = newRow.insertCell();

    categoryCell.textContent = category;
    amountCell.textContent = amount;
    infoCell.textContent = info;
    dateCell.textContent = date;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('delete-btn');

    deleteBtn.addEventListener('click', function() {
        const index = expenses.findIndex(expense => 
            expense.category === category &&
            expense.amount === amount &&
            expense.info === info &&
            expense.date === date
        );

        if (index !== -1) {
    
            expenses.splice(index, 1);

            if (category === 'Income') {
                totalAmount -= amount;
            } else if (category === 'Expense') {
                totalAmount += amount;
            }

            totalAmountCell.textContent = totalAmount;

            expenseTableBody.removeChild(newRow);

            saveData();
        }
    });

    deleteCell.appendChild(deleteBtn);

    categorySelect.value = '';
    amountInput.value = '';
    infoInput.value = '';
    dateInput.value = '';

    saveData();

    sendDataToBackend({ category, amount, info, date });
});

function sendDataToBackend(data) {

    data.date = new Date(data.date).toISOString();

    fetch('http://localhost:5000/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Server response:', data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function saveData() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
    localStorage.setItem('totalAmount', totalAmount);
}

function loadData() {
    const storedExpenses = localStorage.getItem('expenses');
    if (storedExpenses) {
        expenses = JSON.parse(storedExpenses);
    }

    const storedTotalAmount = localStorage.getItem('totalAmount');
    if (storedTotalAmount) {
        totalAmount = parseFloat(storedTotalAmount);
    }

    totalAmountCell.textContent = totalAmount;

    renderTable();
}

function renderTable() {
    expenseTableBody.innerHTML = '';

    expenses.forEach(expense => {
        const newRow = expenseTableBody.insertRow();
        const categoryCell = newRow.insertCell();
        const amountCell = newRow.insertCell();
        const infoCell = newRow.insertCell();
        const dateCell = newRow.insertCell();
        const deleteCell = newRow.insertCell();

        categoryCell.textContent = expense.category;
        amountCell.textContent = expense.amount;
        infoCell.textContent = expense.info;
        dateCell.textContent = expense.date;

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.addEventListener('click', function() {
        });

        deleteCell.appendChild(deleteBtn);
    });
}

window.addEventListener('load', function() {
    loadData();
});
