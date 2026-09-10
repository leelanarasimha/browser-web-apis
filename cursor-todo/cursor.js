const request = indexedDB.open('todo-db', 2);
let lastKey = null;
let firstKey = null;
let db;
console.log('hi leela');

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

  //testAbort();
  testRequestError();

  //addTodo();
  //createTodos(db);
};

function testRequestError() {
  const transaction = db.transaction('todos', 'readwrite');
  const store = transaction.objectStore('todos');

  transaction.oncomplete = () => {
    console.log('Transaction completed');
  };

  transaction.onerror = () => {
    console.log('Transaction error sss');
  };

  transaction.onabort = () => {
    console.log('Transaction aborted');
  };

  const request1 = store.add({
    id: 107,
    title: 'Todo 107',
    status: 'pending'
  });

  const request2 = store.add({
    id: 107,
    title: 'Todo 107 duplicate',
    status: 'pending'
  });

  request1.onsuccess = () => {
    console.log('success request 1 ');
  };

  request2.onerror = (event) => {
    event.preventDefault();
    console.log('request 2 failed ');
  };
}

function testAbort() {
  const transaction = db.transaction('todos', 'readwrite');
  const store = transaction.objectStore('todos');

  transaction.onabort = () => {
    console.log('Transaction aborted');
  };

  transaction.oncomplete = () => {
    console.log('Transaction completed');
  };

  store.add({
    id: 106,
    title: 'Todo 106',
    status: 'pending'
  });

  transaction.abort();

  console.log('After abort()');
}

request.onerror = (event) => {
  console.log(event);
};

function addTodo() {
  const transaction = db.transaction('todos', 'readwrite');
  const store = transaction.objectStore('todos');
  store.add({
    id: 103,
    title: 'Todo 103',
    status: 'pending'
  });

  store.add({
    id: 103,
    title: 'Todo 103 again',
    status: 'pending'
  });

  transaction.oncomplete = () => {
    console.log('transaction completed');
  };

  // transaction.onerror = (event) => {
  //   console.log('Transaction error');
  // };

  transaction.onabort = () => {
    console.log('Transaction aborted');
  };
}

function displayTodos(direction = 'next') {
  nextBtn.disabled = false;
  previousBtn.disabled = false;
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
      if (todos.length > 0) {
        renderTodos(todos, direction);
        nextBtn.disabled = true;
      }

      return;
    }

    todos.push(cursor.value);

    if (todos.length === 10) {
      renderTodos(todos, direction);
      return;
    }

    cursor.continue();
  };
}

function renderTodos(todos, direction = 'next') {
  if (direction === 'prev') {
    todos.reverse();
  }

  firstKey = todos[0].id;
  lastKey = todos[todos.length - 1].id;

  previousBtn.disabled = firstKey === 0;

  const tbody = document.getElementById('todostbody');
  tbody.innerHTML = '';
  todos.forEach((todo) => {
    const row = document.createElement('tr');
    row.innerHTML = `<td>${todo.id}</td>
      <td>${todo.title}</td>
      <td>${todo.status}</td>`;
    tbody.append(row);
  });
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
