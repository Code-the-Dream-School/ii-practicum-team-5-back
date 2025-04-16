class CustomAPIError extends Error {
  statusCode: number

  constructor(message: string, statusCode: number = 400) {
    super(message)
    this.statusCode = statusCode
    this.name = this.constructor.name;

    Object.setPrototypeOf(this, new.target.prototype)
  }
}

export default CustomAPIError;
