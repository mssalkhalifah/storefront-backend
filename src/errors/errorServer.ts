import ErrorCodes from './errorCodes';
import ErrorException from './errorException';

export default class ServerError {
  static missingParameter(message: string): ErrorException {
    return new ErrorException(ErrorCodes.BAD_REQUEST, this.getErrorMessage(this.missingParameter, message));
  }

  static invalidParameters(message: string): ErrorException {
    return new ErrorException(ErrorCodes.BAD_REQUEST, this.getErrorMessage(this.invalidInput, message));
  }

  static fileNotFound(message: string): ErrorException {
    return new ErrorException(ErrorCodes.NOT_FOUND, this.getErrorMessage(this.fileNotFound, message));
  }

  static invalidInput(message: string): ErrorException {
    return new ErrorException(ErrorCodes.BAD_REQUEST, this.getErrorMessage(this.invalidInput, message));
  }

  static conflictData(message: string): ErrorException {
    return new ErrorException(ErrorCodes.CONFLICT, this.getErrorMessage(this.conflictData, message));
  }

  static unauthorized(message: string): ErrorException {
    return new ErrorException(ErrorCodes.UNAUTHORIZED, this.getErrorMessage(this.unauthorized, message));
  }

  private static getErrorMessage(func: Function, message: string): string {
    return `${func.name}: ${message}`;
  }
}
