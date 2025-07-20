// LocalStorage functions for task persistence
function loadTasks() {
    const savedTasks = localStorage.getItem('todoTasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
}

function saveTasks() {
    localStorage.setItem('todoTasks', JSON.stringify(tasks));
}

let tasks = [];

const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const emptyState = document.getElementById('emptyState');
const clearCompletedBtn = document.getElementById('clearCompleted');
const totalTasksSpan = document.getElementById('totalTasks');
const completedTasksSpan = document.getElementById('completedTasks');
const pendingTasksSpan = document.getElementById('pendingTasks');

// Initialize app
function init() {
    tasks = loadTasks();
    renderTasks();
    updateStats();
}

// Add task
function addTask() {
    const text = todoInput.value.trim();
    if (text === '') return;

    const task = {
        id: Date.now(),
        text: text,
        completed: false,
        createdAt: new Date()
    };

    tasks.unshift(task);
    saveTasks();
    todoInput.value = '';
    renderTasks();
    updateStats();
}

// Toggle task completion
function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
        updateStats();
    }
}

// Delete task
function deleteTask(id) {
    const taskElement = document.querySelector(`[data-id="${id}"]`);
    if (taskElement) {
        taskElement.classList.add('removing');
        setTimeout(() => {
            tasks = tasks.filter(t => t.id !== id);
            saveTasks();
            renderTasks();
            updateStats();
        }, 300);
    }
}

// Clear completed tasks
function clearCompleted() {
    const completedElements = document.querySelectorAll('.todo-item.completed');
    completedElements.forEach(el => el.classList.add('removing'));
    
    setTimeout(() => {
        tasks = tasks.filter(t => !t.completed);
        saveTasks();
        renderTasks();
        updateStats();
    }, 300);
}

// Render tasks
function renderTasks() {
    if (tasks.length === 0) {
        todoList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📝</div>
                <h3>No tasks yet</h3>
                <p>Add your first task below to get started on your productive journey!</p>
            </div>
        `;
        return;
    }

    todoList.innerHTML = tasks.map(task => `
        <div class="todo-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
            <div class="todo-checkbox ${task.completed ? 'checked' : ''}" onclick="toggleTask(${task.id})"></div>
            <div class="todo-text">${escapeHtml(task.text)}</div>
            <button class="todo-delete" onclick="deleteTask(${task.id})">×</button>
        </div>
    `).join('');
}

// Update statistics
function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;

    totalTasksSpan.textContent = total;
    completedTasksSpan.textContent = completed;
    pendingTasksSpan.textContent = pending;

    clearCompletedBtn.style.display = completed > 0 ? 'block' : 'none';
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Event listeners
addBtn.addEventListener('click', addTask);
todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});
clearCompletedBtn.addEventListener('click', clearCompleted);

// Auto-focus input on mobile
todoInput.addEventListener('focus', () => {
    setTimeout(() => {
        todoInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 300);
});

// Initialize the app
init();
