import { body } from 'express-validator'

const addToCart = [
  body('productId')
    .notEmpty()
    .withMessage('Không được để trống')
    .not()
    .isString()
    .withMessage('Phải là số')
    .isNumeric({ no_symbols: true })
    .withMessage('Không hợp lệ'),
]

const updateCart = [
  body('productId')
    .notEmpty()
    .withMessage('Không được để trống')
    .not()
    .isString()
    .withMessage('Phải là số')
    .isNumeric({ no_symbols: true })
    .withMessage('Không hợp lệ'),
  body('quantity')
    .not()
    .isString()
    .withMessage('Phải là số')
    .isInt({ min: 1, allow_leading_zeroes: false })
    .withMessage('Không hợp lệ'),
]

const deleteCard = [...addToCart]

const cartValidate = {
  addToCart,
  updateCart,
  deleteCard,
}

export default cartValidate
