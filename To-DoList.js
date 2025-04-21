document.addEventListener('DOMContentLoaded', function() {
    
    if (localStorage.getItem('loggedIn') !== 'true' || !localStorage.getItem('currentUser')) {
        window.location.href = "login.html";
        return;
    }

    const currentUser = localStorage.getItem('currentUser');
    
    // Elementos del DOM
    const elements = {
        taskInput: document.getElementById('taskInput'),
        addTaskBtn: document.getElementById('addTaskBtn'),
        taskList: document.getElementById('taskList'),
        filterBtns: document.querySelectorAll('.filter-btn'),
        clearAllBtn: document.getElementById('clearAllBtn'),
        taskCount: document.getElementById('taskCount'),
        settingsBtn: document.getElementById('settingsBtn'),
        logoutBtn: document.getElementById('logoutBtn'),
        modal: document.getElementById('settingsModal'),
        closeModal: document.querySelector('.close-modal'),
        saveSettings: document.getElementById('saveSettings'),
        bgColor: document.getElementById('bgColor'),
        fontSize: document.getElementById('fontSize'),
        fontFamily: document.getElementById('fontFamily')
    };

    // Cargar datos del usuario
    let userData = JSON.parse(localStorage.getItem(currentUser)) || {
        preferences: {
            bgColor: "#f5f5f5",
            fontSize: "16px",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            containerBg: "#ffffff"
        },
        tasks: []
    };

    let tasks = userData.tasks || [];
    let currentFilter = 'all';

    // Inicialización
    init();

    function init() {
        loadPreferences();
        renderTasks();
        setupEventListeners();
    }

    function setupEventListeners() {
        elements.addTaskBtn.addEventListener('click', addTask);
        elements.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') addTask();
        });

        elements.filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                elements.filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentFilter = btn.dataset.filter;
                renderTasks();
            });
        });

        elements.clearAllBtn.addEventListener('click', clearCompleted);
        elements.settingsBtn.addEventListener('click', openModal);
        elements.closeModal.addEventListener('click', closeModal);
        elements.saveSettings.addEventListener('click', savePreferences);
        elements.logoutBtn.addEventListener('click', logout);
    }

    // Funciones de tareas
    function addTask() {
        const taskText = elements.taskInput.value.trim();
        if (!taskText) return;

        const newTask = {
            id: Date.now(),
            text: taskText,
            completed: false
        };

        tasks.push(newTask);
        saveTasks();
        elements.taskInput.value = '';
        renderTasks();
    }

    function renderTasks() {
        elements.taskList.innerHTML = '';
        
        const filteredTasks = tasks.filter(task => {
            if (currentFilter === 'all') return true;
            if (currentFilter === 'completed') return task.completed;
            return !task.completed;
        });

        filteredTasks.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
            taskItem.dataset.id = task.id;
            
            taskItem.innerHTML = `
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                <span class="task-text">${task.text}</span>
                <button class="delete-btn"><i class="fas fa-trash"></i></button>
            `;
            
            taskItem.querySelector('.task-checkbox').addEventListener('change', () => toggleTask(task.id));
            taskItem.querySelector('.delete-btn').addEventListener('click', () => deleteTask(task.id));
            
            elements.taskList.appendChild(taskItem);
        });

        updateTaskCounter();
    }

    function toggleTask(id) {
        tasks = tasks.map(task => 
            task.id === id ? {...task, completed: !task.completed} : task
        );
        saveTasks();
        renderTasks();
    }

    function deleteTask(id) {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks();
    }

    function clearCompleted() {
        tasks = tasks.filter(task => !task.completed);
        saveTasks();
        renderTasks();
    }

    function updateTaskCounter() {
        const pendingTasks = tasks.filter(task => !task.completed).length;
        elements.taskCount.textContent = `${pendingTasks} ${pendingTasks === 1 ? 'tarea pendiente' : 'tareas pendientes'}`;
    }

    function saveTasks() {
        const currentUser = localStorage.getItem('currentUser');
        const userData = JSON.parse(localStorage.getItem(currentUser)) || {};
        userData.tasks = tasks;
        localStorage.setItem(currentUser, JSON.stringify(userData));
    }

    // Funciones del modal y preferencias
    function openModal() {
        loadCurrentPreferences();
        elements.modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        elements.modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    function loadCurrentPreferences() {
        const currentUser = localStorage.getItem('currentUser');
        const userData = JSON.parse(localStorage.getItem(currentUser)) || {};
        
        elements.bgColor.value = userData.preferences?.bgColor || '#f5f5f5';
        elements.fontSize.value = userData.preferences?.fontSize || '16px';
        elements.fontFamily.value = userData.preferences?.fontFamily || "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
    }

    function savePreferences() {
        const currentUser = localStorage.getItem('currentUser');
        const userData = JSON.parse(localStorage.getItem(currentUser)) || {};
        
        const preferences = {
            bgColor: elements.bgColor.value,
            fontSize: elements.fontSize.value,
            fontFamily: elements.fontFamily.value,
            containerBg: '#ffffff'
        };

        // Aplicar cambios
        applyPreferences(preferences);

        // Guardar preferencias
        userData.preferences = preferences;
        localStorage.setItem(currentUser, JSON.stringify(userData));

        closeModal();
    }

    function applyPreferences(prefs) {
        const root = document.documentElement;
        root.style.setProperty('--bg-color', prefs.bgColor);
        root.style.setProperty('--font-size', prefs.fontSize);
        root.style.setProperty('--font-family', prefs.fontFamily);
        root.style.setProperty('--container-bg', prefs.containerBg);
    }

    function loadPreferences() {
        const currentUser = localStorage.getItem('currentUser');
        const userData = JSON.parse(localStorage.getItem(currentUser)) || {};
        
        if (userData.preferences) {
            applyPreferences(userData.preferences);
        }
    }

    function logout() {
        localStorage.removeItem('loggedIn');
        localStorage.removeItem('currentUser');
        window.location.href = "login.html";
    }
});
