class AppError extends Error {
  status: number
  name: string
  error: string | object
  constructor(status: number, error: string | object, name: string) {
    super()
    this.status = status
    this.name = name
    this.error = error || 'App Error'
  }
}

export default AppError
