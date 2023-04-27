import { Category } from '@prisma/client'

export const createCategoryTree = (list: any[], parentId: number | null) => {
  const tree: (Category & { children?: Category[] })[] = []
  list.forEach((item: any, index: number) => {
    if (item.parentId === parentId) {
      const newList = [...list]
      newList.splice(index, 1)
      const children = createCategoryTree(newList, item.id)
      if (children.length > 0) {
        item.children = children
      }
      tree.push(item)
    }
  })

  return tree
}
