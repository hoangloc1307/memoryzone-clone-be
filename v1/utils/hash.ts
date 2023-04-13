import bcrypt from 'bcrypt'

export const hashPassword = (password: string) => {
  return bcrypt.hash(password, 10)
}

export const verifyPassword = (password: string, passwordHash: string) => {
  return bcrypt.compare(password, passwordHash)
}
