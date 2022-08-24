// 返回最小堆堆顶元素
function peek(heap) {
  return heap.length === 0 ? null : heap[0]
}

function push(heap, node) {
  let index = heap.length
  heap.push(node)
  siftUp(heap, node, index)
}

function pop(heap) {
  if (heap.length === 0) {
    return null
  }
  const first = heap[0]
  const last = heap.pop()

  if (first !== last) {
    heap[0] = last
    siftDown(heap, last, 0)
  }

  return first
}

function siftUp(heap, node, i) {
  let index = i

  while (index > 0) {
    let parentId = (index - 1) >> 1
    let parent = heap[parentId]
    if (compare(parent, node) > 0) {
      node[parentId] = node
      node[index] = parent
      index = parentId
    } else {
      return
    }
  }
}

function siftDown(heap, node, i) {
  let index = i
  const len = heap.length
  const halfLen = len >> 1
  while (index < halfLen) {
    const leftIndex = (index + 1) * 2 - 1
    const rightIndex = leftIndex + 1
    const left = heap[leftIndex]
    const right = heap[rightIndex]
    if (compare(node, left) > 0) {
      if (rightIndex < len && compare(left, right) > 0) {
        heap[index] = right
        heap[rightIndex] = node
        index = rightIndex
      } else {
        heap[index] = left
        heap[leftIndex] = node
        index = leftIndex
      }
    } else {
      if (rightIndex < len && compare(node, right) > 0) {
        heap[index] = right
        heap[rightIndex] = node
        index = rightIndex
      } else {
        return
      }
    }
  }
}

function compare(a, b) {
  const diff = a.sortIndex - b.sortIndex
  return diff !== 0 ? diff : a.id - b.id
}
