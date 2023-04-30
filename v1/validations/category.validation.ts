import { body, param } from 'express-validator'

const addCategory = [
  // Name
  body('name').trim().notEmpty({ ignore_whitespace: true }).withMessage('Tên là bắt buộc'),
  // Parent id
  body('parentId')
    .if(body('parentId').exists({ values: 'null' }))
    .isNumeric({ no_symbols: true })
    .withMessage('Phải là số'),
  // Order
  body('order')
    .if(body('order').exists({ values: 'null' }))
    .isNumeric({ no_symbols: true })
    .withMessage('Phải là số'),
]

const updateCategory = [
  // Id
  param('id').trim().isNumeric({ no_symbols: true }).withMessage('Phải là số'),
  // Name
  body('name')
    .if(body('name').exists({ values: 'null' }))
    .trim(),
  // Parent id
  body('parentId')
    .if(body('parentId').exists({ values: 'null' }))
    .isNumeric({ no_symbols: true })
    .withMessage('Phải là số'),
  // Order
  body('order')
    .if(body('order').exists({ values: 'null' }))
    .isNumeric({ no_symbols: true })
    .withMessage('Phải là số'),
]

const deleteCategory = [param('id').trim().isNumeric({ no_symbols: true }).withMessage('Phải là số')]

const categoryValidate = {
  addCategory,
  updateCategory,
  deleteCategory,
}

export default categoryValidate
