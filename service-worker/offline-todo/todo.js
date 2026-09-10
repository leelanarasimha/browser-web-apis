document.addEventListener('DOMContentLoaded', init);

navigator.serviceWorker.addEventListener('message', (event) => {
  if (event.data.type === 'CACHE_MESSAGE') {
    renderMessage(event.data.message);
  }
});

const request = indexedDB.open('todo-db', 10);

request.error = (event) => {
  console.log(event);
};

request.onsuccess = (event) => {
  console.log('hi leela');
  const db = event.target.result;

  //createTodos(db);
  // readTodo(db);

  //readTodoWithCursor(db);

  addTodo(db);
};

function addTodo(db) {
  const transaction = db.transaction('todos');
  const store = db.objectStore('todos');
  store.add({
    id: 101,
    title: `title 101`,
    status: 'completed'
  });

  transaction.oncompleted = () => {
    console.log('transaction completed');
  };
}

function readTodoWithCursor(db) {
  const transaction = db.transaction('todos', 'readwrite');
  const store = transaction.objectStore('todos');
  const index = store.index('statusIndex');
  const range = IDBKeyRange.only('pending');
  const request = index.openCursor(range, 'nextunique');

  request.onsuccess = (event) => {
    const cursor = event.target.result;
    if (cursor) {
      console.log(cursor.key);
      console.log(cursor.value);
      cursor.continue();
    } else {
      console.log('done');
    }
  };
}

function readTodo(db) {
  const transaction = db.transaction('todos', 'readonly');
  const store = transaction.objectStore('todos');

  const index = store.index('tagIndex');

  const request = index.getAllKeys('javascript');

  // const request = store.getAllKeys();

  request.onsuccess = (event) => {
    console.log(event.target.result);
  };
}

function createTodos(db) {
  const transaction = db.transaction('todos', 'readwrite');
  const store = transaction.objectStore('todos');

  store.add({
    id: 1,
    title: 'title 1',
    status: 'pending',
    tags: ['javascript', 'web', 'browser']
  });
  store.add({
    id: 2,
    title: 'title 2',
    status: 'completed',
    tags: ['javascript', 'node', 'server']
  });
  store.add({
    id: 3,
    title: 'title 3',
    status: 'pending',
    tags: ['php', 'web', 'server']
  });
  store.add({
    id: 4,
    title: 'title 4',
    status: 'completed',
    tags: ['javascript', 'web', 'server']
  });
  store.add({
    id: 5,
    title: 'title 5',
    status: 'pending',
    tags: ['php', 'web', 'browser']
  });
}

request.onupgradeneeded = (event) => {
  const db = event.target.result;
  const transaction = event.target.transaction;

  if (!db.objectStoreNames.contains('todos')) {
    db.createObjectStore('todos', {
      keyPath: 'id'
    });
  }

  const store = transaction.objectStore('todos');

  if (!store.indexNames.contains('statusIndex')) {
    store.createIndex('statusIndex', 'status');
  }

  if (!store.indexNames.contains('tagIndex')) {
    store.createIndex('tagIndex', 'tags', { multiEntry: true });
  }
};

async function init() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js');
  }
  const todoButtonElement = document.querySelector('#todo-button');
  const deleteButtonElement = document.querySelector('#delete-button');
  todoButtonElement.addEventListener('click', () => getTodoValueEvent());
  deleteButtonElement.addEventListener('click', () => deleteTodoEvent());
}

async function deleteTodoEvent() {
  const todoId = getTodoId();
  navigator.serviceWorker.controller.postMessage({
    type: 'DELETE_CACHE',
    todoId
  });
}

async function getTodoValueEvent() {
  const todoId = getTodoId();
  const request = generateRequestUrl(todoId);
  const response = await getTodoResponse(request);
  const data = await response.json();
  renderData(data);
}

function renderMessage(message) {
  const messageElement = document.querySelector('#message');
  messageElement.textContent = message;
}

function renderData(data) {
  const containerElement = document.querySelector('#todo-container');
  containerElement.innerHTML = '';
  const divElement = document.createElement('div');
  let values = ['id', 'title', 'completed'];

  for (let value of values) {
    const element = document.createElement('div');
    element.textContent = `${value}: ${data[value]}`;
    divElement.append(element);
  }
  containerElement.append(divElement);
}

function getTodoId() {
  const todoSelectElement = document.querySelector('#todo-select');
  const todoId = todoSelectElement?.value;
  return todoId;
}

function getTodoResponse(request) {
  console.log(navigator.serviceWorker.controller);
  return fetch(request);
}

function generateRequestUrl(todoId) {
  const url = `https://jsonplaceholder.typicode.com/todos/${todoId}`;
  return new Request(url);
}
function getCache(cache, request) {
  return cache.match(request);
}
async function saveToCache(cache, request, response) {
  await cache.put(request, response.clone());
}
