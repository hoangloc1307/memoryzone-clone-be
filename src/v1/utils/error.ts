class AppError extends Error {
  status: number
  error: string | object
  constructor(status: number, error: string | object) {
    super()
    this.status = status
    this.error = error
  }
}

export default AppError
