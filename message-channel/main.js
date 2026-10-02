const WORKER_COUNT = 3;

const workers = [];
const taskQueue = [];
const pendingTasks = new Map();
let nextTaskId = 1;

function createWorker(workerId) {
  const worker = new Worker('./worker.js');
  const workerSlot = {
    id: workerId,
    worker,
    busy: false,
    taskId: null
  };
  worker.onmessage = (event) => {
    const { taskId, result } = event.data;
    console.log(`Worker ${workerSlot.id}: Completed taskId ${taskId} with result ${result}  `);
    workerSlot.busy = false;
    workerSlot.taskId = null;
    const task = pendingTasks.get(taskId);
    if (task) {
      task.resolve(result);
    }
    pendingTasks.delete(taskId);
    schedule();
  };

  worker.onerror = (error) => {
    console.error(`Worker ${workerSlot.id}: Error occurred -`, error.message);
    const failedTaskId = workerSlot.taskId;
    if (failedTaskId !== null) {
      const task = pendingTasks.get(failedTaskId);
      if (task) {
        task.reject(new Error(`Task ${failedTaskId} failed in Worker ${workerSlot.id}: ${error.message}`));
      }
      pendingTasks.delete(failedTaskId);
    }
    workerSlot.worker.terminate();
    const index = workers.indexOf(workerSlot);
    if (index !== -1) {
      workers.splice(index, 1);
    }
    console.log(`Main: Worker ${workerSlot.id} terminated due to error. Creating a new worker.`);
    const replacementWorkker = createWorker(workerSlot.id);
    workers.push(replacementWorkker);
    console.log(`Main: New Worker ${replacementWorkker.id} created to replace Worker ${workerSlot.id}`);
    schedule();
  };
  return workerSlot;
}

for (let i = 0; i < WORKER_COUNT; i++) {
  const workerSlot = createWorker(i + 1);
  workers.push(workerSlot);
}

function execute(value) {
  return new Promise((resolve, reject) => {
    const task = {
      id: nextTaskId++,
      value,
      resolve,
      reject
    };
    taskQueue.push(task);
    schedule();
  });
}

function schedule() {
  for (const workerSlot of workers) {
    if (workerSlot.busy) continue;
    if (taskQueue.length === 0) return;
    const task = taskQueue.shift();
    workerSlot.busy = true;
    workerSlot.taskId = task.id;
    pendingTasks.set(task.id, task);
    console.log(`Main: Assigning taskId ${task.id} with value ${task.value} to Worker ${workerSlot.id}`);
    workerSlot.worker.postMessage({ taskId: task.id, value: task.value });
  }
}

(async () => {
  const promises = [execute(1), execute(2), execute(3), execute(4), execute(5), execute(6)];

  const results = await Promise.allSettled(promises);
  console.log('All tasks completed with results:', results);
})();
