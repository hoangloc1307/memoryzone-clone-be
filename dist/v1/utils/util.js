"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCategoryTree = void 0;
const createCategoryTree = (list, parentId) => {
    const tree = [];
    list.forEach((item, index) => {
        if (item.parentId === parentId) {
            const newList = [...list];
            newList.splice(index, 1);
            const children = (0, exports.createCategoryTree)(newList, item.id);
            if (children.length > 0) {
                item.children = children;
            }
            tree.push(item);
        }
    });
    return tree;
};
exports.createCategoryTree = createCategoryTree;
// export const createCategoryTree = (list: any[], parentId: number | null) => {
//   // Tạo một đối tượng Map để lưu trữ các danh sách con theo id
//   const map = new Map<number | null, any[]>()
//   list.forEach(item => {
//     // Nếu phần tử có parentId, thì thêm nó vào danh sách con của parentId đó
//     const children = map.get(item.parentId) || []
//     children.push(item)
//     map.set(item.parentId, children)
//   })
//   // Hàm đệ quy để tạo cây từ một phần tử cha
//   const createTree = (parentId: number | null) => {
//     // Lấy danh sách con của phần tử cha từ map
//     const children = map.get(parentId) || []
//     // Nếu không có danh sách con, trả về mảng rỗng
//     if (children.length === 0) {
//       return []
//     }
//     // Nếu có danh sách con, duyệt qua từng phần tử và gọi đệ quy để tạo cây cho chúng
//     return children.map(item => {
//       const tree = { ...item }
//       const subTree = createTree(item.id)
//       if (subTree.length > 0) {
//         tree.children = subTree
//       }
//       return tree
//     })
//   }
//   // Gọi hàm đệ quy với parentId ban đầu
//   return createTree(parentId)
// }
//# sourceMappingURL=util.js.map