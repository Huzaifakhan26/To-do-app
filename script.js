class TodoList {
    constructor() {
        this.todos = JSON.parse(localStorage.getItem('todos')) || [];
        this.todoInput = document.getElementById('todo-input');
        this.addButton = document.getElementById('add-button');
        this.todosContainer = document.getElementById('todos-container');

        this.addButton.addEventListener('click', () => this.addTodo());
        this.todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTodo();
            }
        });
        this.loadTodos();
    }

    addTodo() {
        const text = this.todoInput.value.trim();
        if (!text) return;

        const todo = {
            id: Date.now(),
            text: text,
            completed: false
        };
        
        this.todos.push(todo);
        this.saveTodos();
        this.renderTodo(todo);
        this.clearInputs();
    }

    renderTodo(todo) {
        const todoElement = document.createElement('div');
        todoElement.classList.add('todo-item');
        todoElement.dataset.id = todo.id;

        const content = document.createElement('div');
        content.classList.add('todo-content');

        const text = document.createElement('div');
        text.classList.add('todo-text');
        text.contentEditable = true;
        text.textContent = todo.text;
        if (todo.completed) text.classList.add('completed');

        let clickTimeout;
        text.addEventListener('click', (e) => {
            if (window.getSelection().toString()) {
                return;
            }

            if (clickTimeout) {
                clearTimeout(clickTimeout);
                clickTimeout = null;
                return;
            }

            clickTimeout = setTimeout(() => {
                clickTimeout = null;
                if (!text.classList.contains('editing')) {
                    text.classList.add('editing');
                    text.focus();
                    const range = document.createRange();
                    const sel = window.getSelection();
                    range.selectNodeContents(text);
                    range.collapse(false);
                    sel.removeAllRanges();
                    sel.addRange(range);
                }
            }, 200);
        });

        text.addEventListener('dblclick', (e) => {
            e.preventDefault();
            if (!text.classList.contains('editing')) {
                this.toggleComplete(todo.id);
            }
        });

        text.addEventListener('blur', () => {
            text.classList.remove('editing');
            const newText = text.textContent.trim();
            if (newText && newText !== todo.text) {
                todo.text = newText;
                this.saveTodos();
            }
        });

        text.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                text.blur();
            }
        });

        content.appendChild(text);

        const actions = document.createElement('div');
        actions.classList.add('todo-actions');

        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete-btn');
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.addEventListener('click', () => this.deleteTodo(todo.id));

        actions.appendChild(deleteBtn);

        todoElement.appendChild(content);
        todoElement.appendChild(actions);

        this.todosContainer.appendChild(todoElement);
    }

    deleteTodo(id) {
        this.todos = this.todos.filter(todo => todo.id !== id);
        this.saveTodos();
        this.refreshTodos();
    }

    toggleComplete(id) {
        const todo = this.todos.find(t => t.id === id);
        todo.completed = !todo.completed;
        this.saveTodos();
        this.refreshTodos();
    }

    clearInputs() {
        this.todoInput.value = '';
    }

    saveTodos() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }

    loadTodos() {
        this.todos.forEach(todo => this.renderTodo(todo));
    }

    refreshTodos() {
        this.todosContainer.innerHTML = '';
        this.loadTodos();
    }
}

// Initialize the todo list
const todoList = new TodoList(); 