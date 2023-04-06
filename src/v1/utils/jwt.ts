import jwt from 'jsonwebtoken'

export const signToken = (payload: string | object, secretKey: string, options?: jwt.SignOptions) => {
  return jwt.sign(payload, secretKey, options)
}
