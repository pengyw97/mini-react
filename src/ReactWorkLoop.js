import {
  ClassComponent,
  Fragment,
  FunctionComponent,
  HostComponent,
  HostText,
} from './ReactWorkTags'

const wip = null // work in progress 正在执行中的任务

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
