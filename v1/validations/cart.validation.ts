import { body } from 'express-validator'

const addToCart = [
  body('productId')
    .notEmpty()
    .withMessage('Không được để trống')
    .isInt({ min: 1 })
    .toInt()
    .withMessage('Phải là số nguyên lớn hơn 0'),
]

const updateCart = [
  body('productId')
    .notEmpty()
    .withMessage('Không được để trống')
    .isInt({ min: 1 })
    .toInt()
    .withMessage('Phải là số nguyên lớn hơn 0'),
  body('quantity')
    .notEmpty()
    .withMessage('Không được để trống')
    .isInt({ min: 1 })
    .toInt()
    .withMessage('Phải là số nguyên lớn hơn 0'),
]

const deleteCard = [
  body('productId')
    .notEmpty()
    .withMessage('Không được để trống')
    .isInt({ min: 1 })
    .toInt()
    .withMessage('Phải là số nguyên lớn hơn 0'),
]

const cartValidate = {
  addToCart,
  updateCart,
  deleteCard,
}

export default cartValidate
