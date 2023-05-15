import { body, param } from 'express-validator'

const addType = [
  // Name
  body('name').trim().notEmpty({ ignore_whitespace: true }).withMessage('Tên là bắt buộc'),
]

const updateType = [
  // Id
  param('id').trim().isNumeric({ no_symbols: true }).withMessage('Phải là số'),
  // Type
  body('type')
    .if(body('type').exists({ values: 'null' }))
    .trim(),
  // Attributes
  body('attributes')
    .if(body('attributes').exists({ values: 'null' }))
    .isArray()
    .withMessage('Phải là mảng'),
]

const deleteType = [param('id').trim().isNumeric({ no_symbols: true }).withMessage('Phải là số')]

const typeValidate = {
  addType,
  updateType,
  deleteType,
}

export default typeValidate
