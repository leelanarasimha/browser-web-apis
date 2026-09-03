const request = indexedDB.open('todo-db', 1);
let lastKey = null;
let firstKey = null;
let db;

const previousBtn = document.getElementById('previousBtn');
const nextBtn = document.getElementById('nextBtn');

previousBtn.addEventListener('click', (event) => {
  displayTodos('prev');
});

nextBtn.addEventListener('click', (event) => {
  displayTodos('next');
});

request.onsuccess = (event) => {
  db = event.target.result;
  displayTodos();
  //createTodos(db);
};

function displayTodos(direction = 'next') {
  const transaction = db.transaction('todos', 'readonly');
  const store = transaction.objectStore('todos');
  let range;

  if (direction === 'next') {
    range = lastKey === null ? null : IDBKeyRange.lowerBound(lastKey, true);
  } else {
    range = firstKey === null ? null : IDBKeyRange.upperBound(firstKey, true);
  }

  const request = store.openCursor(range, direction);

  const todos = [];
  request.onsuccess = (event) => {
    const cursor = event.target.result;
    if (!cursor) {
      console.log('no records');
      return;
    }

    todos.push(cursor.value);

    if (todos.length === 5) {
      if (direction === 'prev') {
        todos.reverse();
      }

      firstKey = todos[0].id;
      lastKey = todos[todos.length - 1].id;

      const tbody = document.getElementById('todostbody');
      tbody.innerHTML = '';
      todos.forEach((todo) => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${todo.id}</td>
      <td>${todo.title}</td>
      <td>${todo.status}</td>`;
        tbody.append(row);
      });
      return;
    }

    cursor.continue();
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
