class AppError extends Error {
  status: number
  error: string
  constructor(status: number, error: string) {
    super()
    this.status = status
    this.error = error
  }
}

export default AppError
