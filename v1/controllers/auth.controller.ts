import { NextFunction, Request, Response, response } from 'express'
import { jwtConfig } from '../configs/jwt'
import { STATUS } from '../constants/httpStatus'
import AppError from '../utils/error'
import { hashPassword, verifyPassword } from '../utils/hash'
import { signToken } from '../utils/jwt'
import prismaClient from '../utils/prisma'
import { responseSuccess } from '../utils/response'

// [POST] /auth/register
const register = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password, name } = req.body

  // Check email exists
  const existsEmail = await prismaClient.account.findUnique({
    where: {
      email: email,
    },
  })

  if (!existsEmail) {
    // Hash password
    const passwordHash = await hashPassword(password)

    // Save to dabatabase
    const account = await prismaClient.account.create({
      data: {
        email: email,
        password: passwordHash,
        user: {
          create: {
            email: email,
            name: name,
          },
        },
      },
      select: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    responseSuccess(res, STATUS.Created, { message: 'Đăng ký thành công', data: account })
  } else {
    next(new AppError(STATUS.BadRequest, { email: 'Email đã được đăng ký trước đó' }, 'EMAIL_EXISTS'))
  }
}

// [POST] /auth/login
const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body

  // Check account email exists
  const account = await prismaClient.account.findUnique({
    where: {
      email: email,
    },
    select: {
      id: true,
      status: true,
      password: true,
      role: true,
      user: {
        select: {
          id: true,
          name: true,
          avatar: { select: { link: true } },
        },
      },
    },
  })

  if (account) {
    // Check password right
    const isPasswordRight = await verifyPassword(password, account.password)
    if (isPasswordRight) {
      // Check account status
      if (account.status) {
        // Generate token
        const payload = {
          id: account.user.id,
          role: account.role,
          name: account.user.name,
          avatar: account.user.avatar?.link || null,
        }

        const accessToken = signToken(payload, jwtConfig.AccessTokenSecret, {
          expiresIn: jwtConfig.AccessTokenExpiresTime,
        })
        const refreshToken = signToken(payload, jwtConfig.RefreshTokenSecret, {
          expiresIn: jwtConfig.RefreshTokenExpiresTime,
        })

        // Update table token
        await prismaClient.token.upsert({
          where: {
            accountId: account.id,
          },
          create: {
            accessToken: accessToken,
            refreshToken: refreshToken,
            accountId: account.id,
          },
          update: {
            accessToken: accessToken,
            refreshToken: refreshToken,
          },
        })

        responseSuccess(res, STATUS.Ok, {
          message: 'Login thành công',
          data: {
            ...payload,
            accessToken: accessToken,
            refreshToken: refreshToken,
          },
        })
      } else {
        next(new AppError(STATUS.BadRequest, 'Tài khoản đang bị khoá', 'ACCOUNT_HAS_BEEN_BLOCK'))
      }
    } else {
      next(new AppError(STATUS.BadRequest, 'Sai mật khẩu', 'PASSWORD_WRONG'))
    }
  } else {
    next(new AppError(STATUS.BadRequest, 'Email không tồn tại', 'EMAIL_NOT_EXISTS'))
  }
}

// [DELETE] /auth/logout
const logout = async (req: Request, res: Response, next: NextFunction) => {
  // Delete token in database
  await prismaClient.user.update({
    where: {
      id: req.jwtDecoded.id,
    },
    data: {
      account: {
        update: {
          token: {
            delete: true,
          },
        },
      },
    },
  })

  responseSuccess(res, STATUS.Ok, { message: 'Đăng xuất thành công' })
}

// [PATCH] /auth/refresh-token
const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  // Get account info to create payload
  const account = await prismaClient.account.findUniqueOrThrow({
    where: {
      userId: req.jwtDecoded.id,
    },
    select: {
      id: true,
      role: true,
      user: { select: { id: true, name: true, avatar: { select: { link: true } } } },
    },
  })

  const payload = {
    id: account.user.id,
    role: account.role,
    name: account.user.name,
    avatar: account.user.avatar?.link || null,
  }

  // Generate new token and update to database
  const accessToken = signToken(payload, jwtConfig.AccessTokenSecret, {
    expiresIn: jwtConfig.AccessTokenExpiresTime,
  })
  const refreshToken = signToken(payload, jwtConfig.RefreshTokenSecret, {
    expiresIn: jwtConfig.RefreshTokenExpiresTime,
  })

  await prismaClient.token.update({
    where: {
      accountId: account.id,
    },
    data: {
      accessToken: accessToken,
      refreshToken: refreshToken,
    },
  })

  responseSuccess(res, STATUS.Ok, {
    message: 'Refresh token thành công',
    data: { accessToken: accessToken, refreshToken: refreshToken },
  })
}

// [POST] /auth/get-access-token
// const getAccessToken = async (req: Request, res: Response, next: NextFunction) => {
//   const { data } = req
//   const { email, token, name, image } = req.body

//   const account = await prismaClient.account.findFirst({
//     where: {
//       email: email,
//     },
//     include: {
//       token: true,
//       user: {
//         include: {
//           avatar: true,
//         },
//       },
//     },
//   })
//   // Check email is exists
//   if (account) {
//     if (account.status) {
//       // Generate token and update to database
//       const payload = {
//         id: account.user.id,
//         email: account.email,
//         role: account.role,
//         name: account.user.name,
//         avatar: account.user.avatar?.link || null,
//       }

//       const accessToken = signToken(payload, jwtConfig.AccessTokenSecret, {
//         expiresIn: jwtConfig.AccessTokenExpiresTime,
//       })
//       const refreshToken = signToken(payload, jwtConfig.RefreshTokenSecret, {
//         expiresIn: jwtConfig.RefreshTokenExpiresTime,
//       })

//       await prismaClient.token.upsert({
//         where: {
//           accountId: account.id,
//         },
//         create: {
//           accessToken: accessToken,
//           refreshToken: refreshToken,
//           accountId: account.id,
//         },
//         update: {
//           accessToken: accessToken,
//           refreshToken: refreshToken,
//         },
//       })

//       responseSuccess(res, STATUS.Ok, {
//         message: 'Login thành công',
//         data: {
//           ...payload,
//           accessToken: accessToken,
//           refreshToken: refreshToken,
//         },
//       })
//     } else {
//       next(new AppError(STATUS.Unauthorized, 'Tài khoản đang bị khoá', 'ACCOUT_HAS_BEEN_BLOCK'))
//     }
//   } else {
//     // If not exists email then create new account
//     const passwordHash = await hashPassword(token)
//     const account = await prismaClient.account.create({
//       data: {
//         email: email,
//         password: passwordHash,
//         user: {
//           create: {
//             email: email,
//             name: name,
//             avatar: image,
//           },
//         },
//       },
//       include: {
//         user: {
//           include: {
//             avatar: true,
//           },
//         },
//       },
//     })

//     // Generate token
//     const payload = {
//       id: account.user.id,
//       email: account.email,
//       role: account.role,
//       name: account.user.name,
//       avatar: account.user.avatar?.link || null,
//     }

//     const accessToken = signToken(payload, jwtConfig.AccessTokenSecret, {
//       expiresIn: jwtConfig.AccessTokenExpiresTime,
//     })
//     const refreshToken = signToken(payload, jwtConfig.RefreshTokenSecret, {
//       expiresIn: jwtConfig.RefreshTokenExpiresTime,
//     })

//     await prismaClient.token.create({
//       data: {
//         accessToken: accessToken,
//         refreshToken: refreshToken,
//         accountId: account.id,
//       },
//     })

//     responseSuccess(res, STATUS.Ok, {
//       message: 'Login thành công',
//       data: {
//         ...payload,
//         accessToken: accessToken,
//         refreshToken: refreshToken,
//       },
//     })
//   }
// }

const authController = {
  register,
  login,
  logout,
  refreshToken,
  // getAccessToken,
}

export default authController
