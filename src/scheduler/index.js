import { peek, pop, push } from './minHeap'

let taskIdCounter = 1
let taskQueue = []

export function scheduleCallBack(callBack) {
  const currentTime = getCurrentTime()

  const timeout = -1

  const expirationTime = currentTime + timeout

  const newTask = {
    id: taskIdCounter++,
    sortIndex: expirationTime,
    callBack,
    expirationTime,
  }

  push(taskQueue, newTask)

  // 请求调度
  requestHostCallback()
}

function requestHostCallback() {
  port2.postMessage(null)
}

const { port1, port2 } = new MessageChannel()

port1.onmessage = () => {
  workLoop()
}

function workLoop() {
  let currentTask = peek(taskQueue)
  while (currentTask) {
    const callBack = currentTask.callBack
    currentTask.callBack = null
    callBack()
    pop(taskQueue)
    currentTask = peek(taskQueue)
  }
}

export function getCurrentTime() {
  return performance.now()
}
