// Expense Tracker UI
const API_URL = '';  // Use relative URL since we're served from the same origin

let expenses = [];
let filteredExpenses = [];
let currentFilter = null;

async function init() {
    loadExpenses();
}

async function loadExpenses() {
    try {
        const response = await fetch(`${API_URL}/api/expenses`);
        if (!response.ok) throw new Error('Failed to load expenses');
        expenses = await response.json();
        filteredExpenses = expenses;
        renderExpenses();
        showMessage('Expenses loaded successfully', 'success');
    } catch (error) {
        console.error('Error loading expenses:', error);
        showMessage('Failed to load expenses: ' + error.message, 'error');
    }
}

async function addExpense(e) {
    e.preventDefault();
    
    const amount = document.getElementById('amount').value;
    const category = document.getElementById('category').value;
    const description = document.getElementById('description').value;
    
    if (!amount || !category) {
        showMessage('Please fill in amount and category', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/api/expenses`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                amount: parseFloat(amount),
                category,
                description
            })
        });
        
        if (!response.ok) throw new Error('Failed to add expense');
        
        document.getElementById('expenseForm').reset();
        showMessage('Expense added successfully!', 'success');
        loadExpenses();
    } catch (error) {
        showMessage('Error adding expense: ' + error.message, 'error');
    }
}

async function deleteExpense(id) {
    if (!confirm('Are you sure you want to delete this expense?')) return;
    
    try {
        const response = await fetch(`${API_URL}/api/expenses/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Failed to delete expense');
        
        showMessage('Expense deleted successfully!', 'success');
        loadExpenses();
    } catch (error) {
        showMessage('Error deleting expense: ' + error.message, 'error');
    }
}

function filterByCategory() {
    const category = document.getElementById('filterCategory').value;
    currentFilter = category;
    
    if (category) {
        filteredExpenses = expenses.filter(e => e.category === category);
        showMessage(`Filtered by category: ${category}`, 'success');
    } else {
        filteredExpenses = expenses;
        showMessage('Filter cleared', 'success');
    }
    renderExpenses();
}

function renderExpenses() {
    const tableBody = document.querySelector('tbody');
    
    if (filteredExpenses.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" class="empty-state">No expenses found</td></tr>';
        return;
    }
    
    tableBody.innerHTML = filteredExpenses.map(expense => `
        <tr>
            <td>${expense.id}</td>
            <td class="amount">$${parseFloat(expense.amount).toFixed(2)}</td>
            <td><span class="category-badge">${expense.category}</span></td>
            <td>${expense.description || '-'}</td>
            <td>
                <button class="btn btn-delete" onclick="deleteExpense(${expense.id})">Delete</button>
            </td>
        </tr>
    `).join('');
}

function showMessage(text, type) {
    const container = document.getElementById('messageContainer');
    const message = document.createElement('div');
    message.className = type;
    message.textContent = text;
    
    container.innerHTML = '';
    container.appendChild(message);
    
    setTimeout(() => {
        message.remove();
    }, 4000);
}

// Render the app
document.addEventListener('DOMContentLoaded', () => {
    const root = document.getElementById('root');
    
    root.innerHTML = `
        <div class="container">
            <h1>💰 Expense Tracker</h1>
            
            <div id="messageContainer"></div>
            
            <div class="form-section">
                <h2 style="color: #333; margin-bottom: 15px;">Add New Expense</h2>
                <form id="expenseForm" onsubmit="addExpense(event)">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="amount">Amount ($)</label>
                            <input type="number" id="amount" step="0.01" placeholder="100.00" required>
                        </div>
                        <div class="form-group">
                            <label for="category">Category</label>
                            <select id="category" required>
                                <option value="">Select category</option>
                                <option value="food">Food</option>
                                <option value="transport">Transport</option>
                                <option value="utilities">Utilities</option>
                                <option value="entertainment">Entertainment</option>
                                <option value="shopping">Shopping</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="description">Description</label>
                            <input type="text" id="description" placeholder="Optional description">
                        </div>
                        <button type="submit" class="btn btn-add">Add Expense</button>
                    </div>
                </form>
            </div>
            
            <div class="filter-section">
                <label for="filterCategory">Filter by Category:</label>
                <select id="filterCategory" onchange="filterByCategory()">
                    <option value="">All Categories</option>
                    <option value="food">Food</option>
                    <option value="transport">Transport</option>
                    <option value="utilities">Utilities</option>
                    <option value="entertainment">Entertainment</option>
                    <option value="shopping">Shopping</option>
                    <option value="other">Other</option>
                </select>
            </div>
            
            <div class="expenses-section">
                <h2>All Expenses</h2>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Amount</th>
                            <th>Category</th>
                            <th>Description</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
        </div>
    `;
    
    init();
});
