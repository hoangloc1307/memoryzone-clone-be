import { body } from 'express-validator'

const addProduct = [
  body('name').trim().notEmpty().withMessage('Tên không được để trống'),
  body('price')
    .notEmpty()
    .withMessage('Giá không được để trống')
    .isInt({ allow_leading_zeroes: false, min: 1 })
    .withMessage('Giá không hợp lệ'),
  body('price_discount')
    .if(body('price_discount').notEmpty())
    .isInt({ allow_leading_zeroes: false, min: 1 })
    .withMessage('Giá không hợp lệ'),
  body('quantity')
    .notEmpty()
    .withMessage('Số lượng sản phẩm không được để trống')
    .isInt({ allow_leading_zeroes: false, min: -1 })
    .withMessage('Số lượng sản phẩm không hợp lệ'),
  body('vendor').notEmpty().withMessage('Thương hiệu không được để trống'),
  body('type').notEmpty().withMessage('Loại sản phẩm không được để trống'),
]

const addProductAttributes = [
  body('attributes').isArray({ min: 1 }).withMessage('Thuộc tính sản phẩm phải là mảng và có ít nhất 1 giá trị'),
]

const productValidate = {
  addProduct,
  addProductAttributes,
}

export default productValidate
