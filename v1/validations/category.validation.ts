import { body } from 'express-validator'

const addCategory = [
  // Name
  body('name').trim().notEmpty({ ignore_whitespace: true }).withMessage('Tên là bắt buộc'),
  // Parent id
  body('parentId')
    .if(body('parentId').exists({ values: 'null' }))
    .isNumeric({ no_symbols: true })
    .withMessage('Phải là số'),
]

const categoryValidate = {
  addCategory,
}

export default categoryValidate
