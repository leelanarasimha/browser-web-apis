document.addEventListener('DOMContentLoaded', init);

navigator.serviceWorker.addEventListener('message', (event) => {
  if (event.data.type === 'CACHE_MESSAGE') {
    renderMessage(event.data.message);
  }
});

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
