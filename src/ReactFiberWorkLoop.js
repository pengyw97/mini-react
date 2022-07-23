import {
  ClassComponent,
  Fragment,
  FunctionComponent,
  HostComponent,
  HostText,
} from './ReactWorkTags'
import {
  updateHostComponent,
  updateHostTextComponent,
  updateFunctionComponent,
  updateClassComponent,
  updateFragmentComponent,
} from './ReactFiberReconciler'
import { Placement } from './utils'

let wip = null // work in progress 正在执行中的任务
let wipRoot = null

// 初次渲染、更新
export function scheduleUpdateOnFiber(fiber) {
  wip = fiber
  wipRoot = fiber
}

function performUnitOfWork() {
  const { tag } = wip

  switch (tag) {
    case HostComponent:
      updateHostComponent(wip)
      break
    case HostText:
      updateHostTextComponent(wip)
      break
    case FunctionComponent:
      updateFunctionComponent(wip)
      break
    case ClassComponent:
      updateClassComponent(wip)
      break
    case Fragment:
      updateFragmentComponent(wip)
      break
    default:
      break
  }

  // 决定下一个该更新谁
  // 更新优先级如下：
  // child =》 sibling =》 return sibling
  // 子 =》 兄弟 =》 父级兄弟
  if (wip.child) {
    wip = wip.child
    return
  }

  let next = wip

  while (next) {
    if (next.sibling) {
      wip = next.sibling
      return
    }

    next = next.return
  }

  wip = null
}

function workLoop(IdleDeadline) {
  while (wip && IdleDeadline.timeRemaining() > 0) {
    performUnitOfWork()
  }

  if (!wip && wipRoot) {
    commitRoot()
  }
}

requestIdleCallback(workLoop)

function commitRoot() {
  commitWorker(wipRoot)
  wipRoot = null
}

function commitWorker(wip) {
  if (!wip) return
  const { flags, stateNode } = wip
  const parentNode = getParentNode(wip.return)
  // 1. 提交自己
  if (flags & Placement && stateNode) {
    parentNode.appendChild(stateNode)
  }
  // 2. 提交子节点
  commitWorker(wip.child)
  // 3. 提交兄弟节点
  commitWorker(wip.sibling)
}

function getParentNode(wip) {
  let tem = wip
  while (tem) {
    if (tem.stateNode) {
      return tem.stateNode
    }
    tem = tem.return
  }
}
