declare namespace Express {
  interface Request {
    jwtDecoded: any
    data: any
  }
}
