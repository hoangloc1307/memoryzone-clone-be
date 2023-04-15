import jwt, { JwtPayload } from 'jsonwebtoken'
import AppError from './error'
import { STATUS } from '../constants/httpStatus'

export const signToken = (payload: string | object, secretKey: string, options?: jwt.SignOptions) => {
  return jwt.sign(payload, secretKey, options)
}

export const verifyToken = (token: string, secretKey: string) => {
  return new Promise<JwtPayload>((resolve, reject) => {
    jwt.verify(token, secretKey, (err, decoded) => {
      if (!err) {
        resolve(decoded as JwtPayload)
      } else {
        if (err.name === 'TokenExpiredError') {
          reject(new AppError(STATUS.Unauthorized, 'Token hết hạn', 'TOKEN_EXPIRED'))
        } else {
          reject(new AppError(STATUS.Unauthorized, 'Token không đúng', 'TOKEN_ERROR'))
        }
      }
    })
  })
}
