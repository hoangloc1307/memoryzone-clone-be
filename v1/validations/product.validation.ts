import { body } from 'express-validator'

const updateProduct = [
  body('id')
    .notEmpty()
    .withMessage('Không được để trống')
    .not()
    .isString()
    .withMessage('Phải là số')
    .isNumeric({ no_symbols: true })
    .withMessage('Không hợp lệ'),
  body('name')
    .if(body('name').exists({ checkNull: true, checkFalsy: true }))
    .trim(),
  body('price')
    .if(body('price').exists({ checkNull: true, checkFalsy: true }))
    .not()
    .isString()
    .withMessage('Phải là số')
    .isNumeric({ no_symbols: true })
    .withMessage('Không hợp lệ'),
  body('priceDiscount')
    .if(body('priceDiscount').exists({ checkNull: true, checkFalsy: true }))
    .not()
    .isString()
    .withMessage('Phải là số')
    .isNumeric({ no_symbols: true })
    .withMessage('Không hợp lệ'),
  body('view')
    .if(body('view').exists({ checkNull: true, checkFalsy: true }))
    .not()
    .isString()
    .withMessage('Phải là số')
    .isNumeric({ no_symbols: true })
    .withMessage('Không hợp lệ'),
  body('quantity')
    .if(body('quantity').exists({ checkNull: true, checkFalsy: true }))
    .not()
    .isString()
    .withMessage('Phải là số')
    .isInt({ allow_leading_zeroes: false, min: -1 })
    .withMessage('Không hợp lệ'),
  body('shortInfo')
    .if(body('shortInfo').exists({ checkNull: true }))
    .isArray()
    .withMessage('Phải là mảng'),
  body('vendor')
    .if(body('vendor').exists({ checkNull: true, checkFalsy: true }))
    .trim(),
  body('description')
    .if(body('description').exists({ checkNull: true, checkFalsy: true }))
    .trim(),
  body('productTypeId')
    .if(body('productTypeId').exists({ checkNull: true, checkFalsy: true }))
    .not()
    .isString()
    .withMessage('Phải là số')
    .isNumeric({ no_symbols: true })
    .withMessage('Không hợp lệ'),
  body('isDraft')
    .if(body('isDraft').exists({ checkNull: true }))
    .isBoolean({ strict: true })
    .withMessage('Không hợp lệ'),
  body('isPublish')
    .if(body('isPublish').exists({ checkNull: true }))
    .isBoolean({ strict: true })
    .withMessage('Không hợp lệ'),
  body('slug')
    .if(body('slug').exists({ checkNull: true, checkFalsy: true }))
    .trim(),
]

const addProductAttributes = [
  body('attributes').isArray({ min: 1 }).withMessage('Phải là mảng và có ít nhất 1 giá trị'),
]

const productValidate = {
  updateProduct,
  addProductAttributes,
}

export default productValidate
