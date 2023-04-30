import { body } from 'express-validator'

const updateProduct = [
  // Name
  body('name')
    .if(body('name').exists({ values: 'null' }))
    .trim(),
  // Price
  body('price')
    .if(body('price').exists({ values: 'null' }))
    .isNumeric({ no_symbols: true })
    .withMessage('Phải là số lớn hơn hoặc bằng 0'),
  // Price discount
  body('priceDiscount')
    .if(body('priceDiscount').exists({ values: 'null' }))
    .isNumeric({ no_symbols: true })
    .withMessage('Phải là số lớn hơn hoặc bằng 0'),
  // Quantity
  body('quantity')
    .if(body('quantity').exists({ values: 'null' }))
    .isInt({ allow_leading_zeroes: false, min: -1 })
    .withMessage('Phải là số lớn hơn hoặc bằng -1'),
  // Short info
  body('shortInfo')
    .if(body('shortInfo').exists({ values: 'null' }))
    .isArray()
    .withMessage('Phải là mảng'),
  // Vendor
  body('vendor')
    .if(body('vendor').exists({ values: 'null' }))
    .trim(),
  // Description
  body('description')
    .if(body('description').exists({ values: 'null' }))
    .trim(),
  // Type id
  body('typeId')
    .if(body('typeId').exists({ values: 'null' }))
    .isNumeric({ no_symbols: true })
    .withMessage('Không hợp lệ'),
  // Draft
  body('isDraft')
    .if(body('isDraft').exists({ values: 'null' }))
    .isBoolean({ strict: true })
    .withMessage('Không hợp lệ'),
  // Publish
  body('isPublish')
    .if(body('isPublish').exists({ values: 'null' }))
    .isBoolean({ strict: true })
    .withMessage('Không hợp lệ'),
  // Slug
  body('slug')
    .if(body('slug').exists({ values: 'null' }))
    .trim(),
  // Attributes
  body('attributes')
    .if(body('attributes').exists({ values: 'null' }))
    .isArray()
    .withMessage('Phải là mảng'),
  // Categories
  body('categories')
    .if(body('categories').exists({ values: 'null' }))
    .isObject()
    .withMessage('Phải là object'),
]

const addProductAttributes = [
  body('attributes').isArray({ min: 1 }).withMessage('Phải là mảng và có ít nhất 1 giá trị'),
]

const deleteProductImage = [
  body('imageId')
    .notEmpty()
    .withMessage('Không được để trống')
    .not()
    .isString()
    .withMessage('Phải là số')
    .isNumeric({ no_symbols: true })
    .withMessage('Không hợp lệ'),
  body('deleteHash').notEmpty().withMessage('Không được để trống'),
]

const productValidate = {
  updateProduct,
  deleteProductImage,
  addProductAttributes,
}

export default productValidate
