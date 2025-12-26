// Colorful Todo App - JavaScript

// Sample todos
let todos = [
    { 
        id: 1, 
        text: 'Learn Angular Basics', 
        completed: true, 
        category: 'work',
        priority: 'high',
        date: '2024-12-20'
    },
    { 
        id: 2, 
        text: 'Buy groceries for dinner', 
        completed: false, 
        category: 'shopping',
        priority: 'medium',
        date: '2024-12-21'
    },
    { 
        id: 3, 
        text: 'Morning exercise routine', 
        completed: false, 
        category: 'personal',
        priority: 'low',
        date: '2024-12-22'
    },
    { 
        id: 4, 
        text: 'Fix critical bug in production', 
        completed: false, 
        category: 'urgent',
        priority: 'high',
        date: '2024-12-23'
    },
    { 
        id: 5, 
        text: 'Plan weekend trip', 
        completed: true, 
        category: 'personal',
        priority: 'medium',
        date: '2024-12-24'
    }
];

let filteredCategory = 'all';

// DOM Elements
const todoInput = document.getElementById('todo-input');
const categorySelect = document.getElementById('category-select');
const prioritySelect = document.getElementById('priority-select');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');
const emptyState = document.getElementById('empty-state');
const clearBtn = document.getElementById('clear-btn');
const categoryButtons = document.querySelectorAll('.category-btn');
const filterIndicator = document.getElementById('filter-indicator');

// Stats elements
const totalTasksEl = document.getElementById('total-tasks');
const pendingTasksEl = document.getElementById('pending-tasks');
const completedTasksEl = document.getElementById('completed-tasks');
const highPriorityEl = document.getElementById('high-priority');
const itemsLeftEl = document.getElementById('items-left');
const progressPercentEl = document.getElementById('progress-percent');
const progressFillEl = document.getElementById('progress-fill');

// Category count elements
const workCountEl = document.getElementById('work-count');
const personalCountEl = document.getElementById('personal-count');
const shoppingCountEl = document.getElementById('shopping-count');
const urgentCountEl = document.getElementById('urgent-count');
const allCountEl = document.getElementById('all-count');

// Celebration modal
const celebrationModal = document.getElementById('celebration-modal');
const closeCelebrationBtn = document.getElementById('close-celebration');

// Initialize the app
function init() {
    renderTodos();
    updateStats();
    updateCategoryCounts();
    setupEventListeners();
    
    // Check if all todos are completed
    checkAllCompleted();
}

// Setup event listeners
function setupEventListeners() {
    // Add todo
    addBtn.addEventListener('click', addTodo);
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTodo();
    });
    
    // Clear completed
    clearBtn.addEventListener('click', clearCompleted);
    
    // Category filter buttons
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.getAttribute('data-category');
            filterByCategory(category);
        });
    });
    
    // Close celebration modal
    closeCelebrationBtn.addEventListener('click', () => {
        celebrationModal.style.display = 'none';
    });
    
    // Close modal when clicking outside
    celebrationModal.addEventListener('click', (e) => {
        if (e.target === celebrationModal) {
            celebrationModal.style.display = 'none';
        }
    });
}

// Get category color
function getCategoryColor(category) {
    const colors = {
        'work': '#3498db',
        'personal': '#9b59b6',
        'shopping': '#2ecc71',
        'urgent': '#e74c3c'
    };
    return colors[category] || '#95a5a6';
}

// Get priority color
function getPriorityColor(priority) {
    const colors = {
        'low': '#3498db',
        'medium': '#f39c12',
        'high': '#e74c3c'
    };
    return colors[priority] || '#95a5a6';
}

// Get category icon
function getCategoryIcon(category) {
    const icons = {
        'work': 'fa-briefcase',
        'personal': 'fa-user',
        'shopping': 'fa-shopping-cart',
        'urgent': 'fa-exclamation-triangle'
    };
    return icons[category] || 'fa-tag';
}

// Get priority icon
function getPriorityIcon(priority) {
    const icons = {
        'low': 'fa-arrow-down',
        'medium': 'fa-equals',
        'high': 'fa-arrow-up'
    };
    return icons[priority] || 'fa-flag';
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
    });
}

// Add todo
function addTodo() {
    const text = todoInput.value.trim();
    if (!text) {
        // Show error animation
        todoInput.style.borderColor = '#e74c3c';
        todoInput.style.boxShadow = '0 0 0 3px rgba(231, 76, 60, 0.2)';
        setTimeout(() => {
            todoInput.style.borderColor = '#e0e0e0';
            todoInput.style.boxShadow = 'none';
        }, 1000);
        return;
    }
    
    const newTodo = {
        id: Date.now(),
        text: text,
        completed: false,
        category: categorySelect.value,
        priority: prioritySelect.value,
        date: new Date().toISOString().split('T')[0]
    };
    
    todos.unshift(newTodo);
    todoInput.value = '';
    
    // Reset selects to default
    categorySelect.value = 'work';
    prioritySelect.value = 'medium';
    
    renderTodos();
    updateStats();
    updateCategoryCounts();
    
    // Show success animation
    addBtn.innerHTML = '<i class="fas fa-check"></i> Added!';
    addBtn.style.background = 'linear-gradient(45deg, #2ecc71, #27ae60)';
    setTimeout(() => {
        addBtn.innerHTML = '<i class="fas fa-plus"></i> Add Todo';
        addBtn.style.background = 'linear-gradient(45deg, #ff6b6b, #ff8e53)';
    }, 1000);
}

// Toggle todo completion
function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        
        // Play checkmark animation
        const checkbox = document.querySelector(`[data-id="${id}"]`);
        if (checkbox) {
            checkbox.checked = todo.completed;
        }
        
        renderTodos();
        updateStats();
        updateCategoryCounts();
        
        // Check if all todos are completed
        checkAllCompleted();
    }
}

// Delete todo
function deleteTodo(id) {
    // Show confirmation with animation
    const todoItem = document.querySelector(`[data-todo-id="${id}"]`);
    if (todoItem) {
        todoItem.style.transform = 'translateX(100px)';
        todoItem.style.opacity = '0';
        
        setTimeout(() => {
            todos = todos.filter(t => t.id !== id);
            renderTodos();
            updateStats();
            updateCategoryCounts();
        }, 300);
    }
}

// Clear completed todos
function clearCompleted() {
    // Animation for clearing
    const completedItems = document.querySelectorAll('.todo-item.completed');
    completedItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.transform = 'translateX(-100px)';
            item.style.opacity = '0';
        }, index * 100);
    });
    
    setTimeout(() => {
        todos = todos.filter(t => !t.completed);
        renderTodos();
        updateStats();
        updateCategoryCounts();
    }, completedItems.length * 100 + 300);
}

// Filter by category
function filterByCategory(category) {
    filteredCategory = category;
    
    // Update active button
    categoryButtons.forEach(button => {
        if (button.getAttribute('data-category') === category) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
    
    // Update filter indicator
    if (category === 'all') {
        filterIndicator.textContent = '';
    } else {
        const filteredTodos = todos.filter(todo => todo.category === category);
        filterIndicator.textContent = `(${filteredTodos.length} ${category} todos)`;
    }
    
    renderTodos();
}

// Get filtered todos
function getFilteredTodos() {
    if (filteredCategory === 'all') {
        return todos;
    }
    return todos.filter(todo => todo.category === filteredCategory);
}

// Render todos
function renderTodos() {
    const filteredTodos = getFilteredTodos();
    
    if (filteredTodos.length === 0) {
        emptyState.style.display = 'block';
        todoList.innerHTML = '';
        return;
    }
    
    emptyState.style.display = 'none';
    
    todoList.innerHTML = filteredTodos.map(todo => `
        <div class="todo-item ${todo.completed ? 'completed' : ''}" data-todo-id="${todo.id}">
            <div class="todo-checkbox-container">
                <input 
                    type="checkbox" 
                    class="todo-checkbox" 
                    id="todo-${todo.id}"
                    data-id="${todo.id}"
                    ${todo.completed ? 'checked' : ''}
                />
                <label for="todo-${todo.id}" class="checkbox-label"></label>
            </div>
            
            <div class="todo-content" onclick="toggleTodo(${todo.id})">
                <span class="todo-text">
                    ${todo.text}
                </span>
                <div class="todo-meta">
                    <span class="category-tag" style="background: ${getCategoryColor(todo.category)}">
                        <i class="fas ${getCategoryIcon(todo.category)}"></i>
                        ${todo.category}
                    </span>
                    <span class="priority-tag" style="background: ${getPriorityColor(todo.priority)}">
                        <i class="fas ${getPriorityIcon(todo.priority)}"></i>
                        ${todo.priority}
                    </span>
                    <span class="todo-date">
                        <i class="fas fa-calendar"></i>
                        ${formatDate(todo.date)}
                    </span>
                </div>
            </div>
            
            <button class="delete-btn" onclick="deleteTodo(${todo.id})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
    
    // Add event listeners to checkboxes
    document.querySelectorAll('.todo-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const id = parseInt(e.target.getAttribute('data-id'));
            toggleTodo(id);
        });
    });
}

// Update statistics
function updateStats() {
    const total = todos.length;
    const completed = todos.filter(t => t.completed).length;
    const pending = total - completed;
    const highPriority = todos.filter(t => t.priority === 'high').length;
    
    totalTasksEl.textContent = total;
    completedTasksEl.textContent = completed;
    pendingTasksEl.textContent = pending;
    highPriorityEl.textContent = highPriority;
    itemsLeftEl.textContent = pending;
    
    // Update progress
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
    progressPercentEl.textContent = progress;
    progressFillEl.style.width = `${progress}%`;
    
    // Animate stat numbers
    animateValue(totalTasksEl, 0, total, 500);
    animateValue(completedTasksEl, 0, completed, 500);
    animateValue(pendingTasksEl, 0, pending, 500);
    animateValue(highPriorityEl, 0, highPriority, 500);
}

// Update category counts
function updateCategoryCounts() {
    const workCount = todos.filter(t => t.category === 'work').length;
    const personalCount = todos.filter(t => t.category === 'personal').length;
    const shoppingCount = todos.filter(t => t.category === 'shopping').length;
    const urgentCount = todos.filter(t => t.category === 'urgent').length;
    const allCount = todos.length;
    
    workCountEl.textContent = workCount;
    personalCountEl.textContent = personalCount;
    shoppingCountEl.textContent = shoppingCount;
    urgentCountEl.textContent = urgentCount;
    allCountEl.textContent = allCount;
}

// Animate number values
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        element.textContent = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Check if all todos are completed
function checkAllCompleted() {
    const allCompleted = todos.length > 0 && todos.every(todo => todo.completed);
    
    if (allCompleted) {
        setTimeout(() => {
            showCelebration();
        }, 500);
    }
}

// Show celebration
function showCelebration() {
    celebrationModal.style.display = 'flex';
    createConfetti();
}

// Create confetti
function createConfetti() {
    const colors = ['#ff6b6b', '#ff8e53', '#ffd93d', '#2ecc71', '#3498db', '#9b59b6'];
    
    for (let i = 0; i < 150; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.width = Math.random() * 10 + 5 + 'px';
        confetti.style.height = Math.random() * 10 + 5 + 'px';
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        confetti.style.animation = `confetti-fall ${Math.random() * 3 + 2}s linear forwards`;
        confetti.style.animationDelay = Math.random() * 2 + 's';
        
        document.body.appendChild(confetti);
        
        // Remove confetti after animation
        setTimeout(() => {
            confetti.remove();
        }, 5000);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Make functions available globally for inline onclick events
window.toggleTodo = toggleTodo;
window.deleteTodo = deleteTodo;
