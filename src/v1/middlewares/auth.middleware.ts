import { body } from 'express-validator'

const registerRules = () => {
  return [
    body('email').isEmail().withMessage('Email không đúng định dạng'),
    body('password')
      .exists({ checkFalsy: true })
      .withMessage('Mật khẩu không được để trống')
      .isLength({ min: 6, max: 32 })
      .withMessage('Mật khẩu phải từ 6-32 kí tự'),
  ]
}

const authMiddleware = {
  registerRules,
}

export default authMiddleware
