import { Category } from '@prisma/client'

export const createCategoryTree = (list: any[], parentId: number | null) => {
  const tree: (Category & { children?: Category[] })[] = []
  const newList = [...list]
  newList.forEach((item, index) => {
    if (item.parentId === parentId) {
      list.splice(index, 1)
      const children = createCategoryTree(list, item.id)
      if (children.length > 0) {
        item.children = children
      }
      tree.push(item)
    }
  })

  return tree
}
