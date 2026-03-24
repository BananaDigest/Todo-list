/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');

let functions;

describe('To-Do List Functionality', () => {
    beforeEach(() => {
    // 1. Обов'язково скидаємо кеш модулів
    jest.resetModules();
    
    // 2. Встановлюємо HTML безпосередньо в body
    document.body.innerHTML = html.toString();
    
    // 3. Очищуємо сховище
    localStorage.clear();
    
    // 4. Важливо: require файлу має бути ТІЛЬКИ ПІСЛЯ встановлення innerHTML
    functions = require('../JS/main.js');
});

    // 1. Тест функції збереження в LocalStorage
    test('savelocal() should save item to localStorage', () => {
        const todo = { text: 'Learn Jest', completed: false };
        functions.savelocal(todo);
        
        const saved = JSON.parse(localStorage.getItem('todos'));
        expect(saved).toHaveLength(1);
        expect(saved[0].text).toBe('Learn Jest');
    });

    // 2. Тест рендерингу (створення елементів в DOM)
    test('renderToDo() should add a new todo element to the list', () => {
        const todo = { text: 'Test DOM', completed: false };
        functions.renderToDo(todo);
        
        const list = document.querySelector(".todo-list");
        expect(list.children.length).toBe(1);
        expect(list.querySelector(".todo-item").innerText).toBe('Test DOM');
    });

    // 3. Тест зміни теми
    test('changeTheme() should change body class and localStorage', () => {
        functions.changeTheme('darker');
        
        expect(document.body.className).toBe('darker');
        expect(localStorage.getItem('savedTheme')).toBe('darker');
    });

    // 4. Тест видалення з LocalStorage
    test('removeLocalTodos() should remove item from localStorage', () => {
        const todo1 = { text: 'Task 1', completed: false };
        const todo2 = { text: 'Task 2', completed: false };
        localStorage.setItem('todos', JSON.stringify([todo1, todo2]));

        // Імітуємо структуру елемента, яку очікує функція
        const mockElement = document.createElement('div');
        const mockLi = document.createElement('li');
        mockLi.innerText = 'Task 1';
        mockElement.appendChild(mockLi);

        functions.removeLocalTodos(mockElement);

        const saved = JSON.parse(localStorage.getItem('todos'));
        expect(saved).toHaveLength(1);
        expect(saved[0].text).toBe('Task 2');
    });

    // 5. Тест оновлення статусу виконання
    test('updateLocalTodos() should toggle completed status in localStorage', () => {
        const todo = { text: 'Update Me', completed: false };
        localStorage.setItem('todos', JSON.stringify([todo]));

        const mockDiv = document.createElement('div');
        mockDiv.classList.add('completed');
        const mockLi = document.createElement('li');
        mockLi.innerText = 'Update Me';
        mockDiv.appendChild(mockLi);

        functions.updateLocalTodos(mockDiv);

        const saved = JSON.parse(localStorage.getItem('todos'));
        expect(saved[0].completed).toBe(true);
    });

    // 6. Тест функції додавання (addToDo)
    test('addToDo() should prevent empty input and show alert', () => {
    window.alert = jest.fn(); 
    const event = { preventDefault: jest.fn() };
    
    const input = document.querySelector(".todo-input");
    if (input) {
        input.value = ""; 
    }
    
    functions.addToDo(event);
    expect(window.alert).toHaveBeenCalledWith("You must write something!");
});
});