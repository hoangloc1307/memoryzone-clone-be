import { body } from 'express-validator'

const loginRules = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email không được để trống')
    .normalizeEmail()
    .isEmail()
    .withMessage('Email không đúng định dạng'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Mật khẩu không được để trống')
    .isLength({ min: 6, max: 32 })
    .withMessage('Mật khẩu phải từ 6-32 kí tự'),
]

const registerRules = [...loginRules, body('name').trim().notEmpty().withMessage('Tên không được để trống')]

const authValidate = {
  loginRules,
  registerRules,
}

export default authValidate
