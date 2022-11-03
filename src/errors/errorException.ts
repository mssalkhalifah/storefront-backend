export default class ErrorException extends Error {
  public statusCode: number;

  constructor(code: number, message: string) {
    super(message);

    this.statusCode = code;
  }
}
