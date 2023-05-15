import { body } from 'express-validator'

const login = [
  // Email
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email không được để trống')
    .normalizeEmail()
    .isEmail()
    .withMessage('Email không đúng định dạng'),
  // Password
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Mật khẩu không được để trống')
    .isLength({ min: 6, max: 32 })
    .withMessage('Mật khẩu phải từ 6-32 kí tự'),
]

const register = [
  ...login,
  // Name
  body('name').trim().notEmpty().withMessage('Tên không được để trống'),
]

const authValidate = {
  login,
  register,
}

export default authValidate
