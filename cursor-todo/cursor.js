const request = indexedDB.open('todo-db', 1);
let db;

request.onsuccess = (event) => {
  db = event.target.result;
  displayTodos();
  //createTodos(db);
};

function displayTodos() {
  const transaction = db.transaction('todos', 'readonly');
  const store = transaction.objectStore('todos');

  const request = store.getAll();
  request.onsuccess = (event) => {
    const todos = event.target.result;

    const tbody = document.getElementById('todostbody');
    todos.forEach((todo) => {
      const row = document.createElement('tr');
      row.innerHTML = `<td>${todo.id}</td>
      <td>${todo.title}</td>
      <td>${todo.status}</td>`;
      tbody.append(row);
    });
  };
}

function createTodos(db) {
  const transaction = db.transaction('todos', 'readwrite');
  const store = transaction.objectStore('todos');

  for (let i = 0; i < 100; i++) {
    store.add({
      id: i,
      title: `title ${i}`,
      status: i % 2 === 0 ? 'completed' : 'pending'
    });
  }
}

request.onupgradeneeded = (event) => {
  const db = event.target.result;

  if (!db.objectStoreNames.contains('todos')) {
    db.createObjectStore('todos', {
      keyPath: 'id'
    });
  }
};

request.onerror = (event) => {
  console.log(event);
};
