import { createFiber } from './ReactFiber'
import { isArray, isStringOrNumber, updateNode } from './utils'

export function updateHostComponent(wip) {
  if (!wip.stateNode) {
    wip.stateNode = document.createElement(wip.type)
    updateNode(wip.stateNode, wip.props)
  }

  reconcilerFiber(wip, wip.props.children)
}

export function updateHostTextComponent() {}

export function updateFunctionComponent(wip) {
  const { type, props } = wip
  const child = type(props)
  reconcilerFiber(wip, child)
}

export function updateClassComponent() {}
export function updateFragmentComponent() {}

function reconcilerFiber(wip, children) {
  if (isStringOrNumber(children)) {
    return
  }
  let previousChild = null
  const newChildren = isArray(children) ? children : [children]

  for (let i = 0; i < newChildren.length; i++) {
    const newChild = newChildren[i]
    if (newChild === null) {
      continue
    }
    const newFiber = createFiber(newChild, wip)

    if (previousChild === null) {
      wip.child = newFiber
    } else {
      previousChild.sibling = newFiber
    }

    previousChild = newFiber
  }
}
