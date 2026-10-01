const WORKER_COUNT = 3;
const TASK_COUNT = 10;

const taskQueue = [];

for (let i = 0; i < TASK_COUNT; i++) {
  taskQueue.push({
    id: i + 1,
    value: i + 1
  });
}

const workers = [];
for (let i = 0; i < WORKER_COUNT; i++) {
  const worker = new Worker('./worker.js');
  const workerSlot = {
    id: i + 1,
    worker: worker,
    busy: false,
    taskId: null
  };

  worker.onmessage = (event) => {
    const { id, result } = event.data;
    console.log(`Worker ${workerSlot.id} completed task ${id} with result: ${result}`);
    workerSlot.busy = false;
    scheduler();
  };
  workers.push(workerSlot);
}

function scheduler() {
  for (const workerSlot of workers) {
    if (workerSlot.busy) {
      continue;
    }
    if (taskQueue.length === 0) {
      return;
    }
    const task = taskQueue.shift();
    workerSlot.busy = true;
    workerSlot.taskId = task.id;
    console.log(`🚀 Worker ${workerSlot.id} → Task ${task.id}`);
    workerSlot.worker.postMessage(task);
  }
}
console.log('Initial Task Queue:', taskQueue);
scheduler();
