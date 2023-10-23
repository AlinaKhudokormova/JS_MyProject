const listName = document.getElementById('list_name');
const newListInput = document.getElementById('created-list__input-list');
const newListButton = document.getElementById('created-list__new-list');

// При завантаженні сторінки відтворюємо збережені значення
window.addEventListener('load', () => {
  const selectValues = JSON.parse(localStorage.getItem('selectValues')) || [];
  selectValues.forEach((value) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = value;
    listName.appendChild(option);
  });
});

newListButton.addEventListener('click', () => {
  const newListName = newListInput.value.trim();

  if (newListName) {
    const formattedListName = newListName.charAt(0).toUpperCase() + newListName.slice(1);

    const newOption = document.createElement('option');
    newOption.value = formattedListName;
    newOption.textContent = formattedListName;

    listName.appendChild(newOption);

    newListInput.value = '';

    // Зберігаємо новий елемент option в LocalStorage
    const selectValues = JSON.parse(localStorage.getItem('selectValues')) || [];
    selectValues.push(formattedListName);
    localStorage.setItem('selectValues', JSON.stringify(selectValues));

    // Створюємо новий список завдань у LocalStorage
    const newTasks = [];
    saveTasks(formattedListName, newTasks);

    // Оновлюємо список завдань для нового списку
    displayTasks(formattedListName);

    // Встановлюємо новий список як вибраний
    updateSelectedList(formattedListName);
  }
});

const dynamicHeading = document.getElementById('dynamic-heading');

listName.addEventListener('change', function () {
    const selectedOption = listName.options[listName.selectedIndex];

    dynamicHeading.textContent = selectedOption.textContent;
});

const todoList = document.getElementById('todo-list');
const inputField = document.querySelector('.container-to-do__items');
const addButton = document.querySelector('.container-to-do__plus-btn');
const createdList = document.querySelector('.created-list');

// Функція для отримання інформації про завдання з LocalStorage для певного списку
function getTasks(selectedList) {
  const tasksKey = `tasks_${selectedList}`;
  return JSON.parse(localStorage.getItem(tasksKey)) || [];
}

// Функція для збереження інформації про завдання в LocalStorage для певного списку
function saveTasks(selectedList, tasks) {
  const tasksKey = `tasks_${selectedList}`;
  localStorage.setItem(tasksKey, JSON.stringify(tasks));
}

// Функція для відображення завдань
function displayTasks(selectedList) {
  const tasks = getTasks(selectedList);
  todoList.innerHTML = '';

  tasks.forEach(task => {
    const listItem = document.createElement('li');
    listItem.innerHTML = `
      <input class="check-mark" type="checkbox" ${task.completed ? 'checked' : ''}>
      <span>${task.text}</span>
      <button class="delete-btn">-</button>
    `;

    const deleteButton = listItem.querySelector('.delete-btn');
    deleteButton.addEventListener('click', () => {
      const index = tasks.indexOf(task);
      if (index !== -1) {
        tasks.splice(index, 1);
        saveTasks(selectedList, tasks);
        listItem.remove();
      }
    });

    const checkbox = listItem.querySelector('.check-mark');
    const span = listItem.querySelector('span');
    checkbox.addEventListener('change', () => {
      task.completed = checkbox.checked;
      span.style.textDecoration = task.completed ? 'line-through' : 'none';
      saveTasks(selectedList, tasks);
    });

    todoList.appendChild(listItem);
  });
}

// Встановлюємо вибраний список з LocalStorage
const selectedList = localStorage.getItem('selectedList') || 'option1';
listName.value = selectedList;

// Оновлюємо список завдань при виборі іншого списку
listName.addEventListener('change', () => {
  const selectedOption = listName.value;
  localStorage.setItem('selectedList', selectedOption);
  displayTasks(selectedOption);
});

// Оновлюємо список завдань при завантаженні сторінки
displayTasks(selectedList);

// Додаємо нове завдання при натисканні на кнопку
addButton.addEventListener('click', () => {
  const inputValue = inputField.value.trim();
  if (inputValue) {
    const tasks = getTasks(selectedList);
    const newTask = { text: inputValue, completed: false };
    tasks.push(newTask);
    saveTasks(selectedList, tasks);

    const listItem = document.createElement('li');
    listItem.innerHTML = `
      <input class="check-mark" type="checkbox">
      <span>${inputValue}</span>
      <button class="delete-btn">-</button>
    `;

    const deleteButton = listItem.querySelector('.delete-btn');
    deleteButton.addEventListener('click', () => {
      const index = tasks.indexOf(newTask);
      if (index !== -1) {
        tasks.splice(index, 1);
        saveTasks(selectedList, tasks);
        listItem.remove();
      }
    });

    const checkbox = listItem.querySelector('.check-mark');
    const span = listItem.querySelector('span');
    checkbox.addEventListener('change', () => {
      newTask.completed = checkbox.checked;
      span.style.textDecoration = newTask.completed ? 'line-through' : 'none';
      saveTasks(selectedList, tasks);
    });

    todoList.appendChild(listItem);
    inputField.value = '';
  }
});
