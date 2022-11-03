import ErrorCodes from './errorCodes';
import ErrorException from './errorException';

export default class ServerError {
  static missingParameter(message: string): ErrorException {
    return new ErrorException(ErrorCodes.BAD_REQUEST, message);
  }

  static invalidParameters(message: string): ErrorException {
    return new ErrorException(ErrorCodes.BAD_REQUEST, message);
  }

  static fileNotFound(message: string): ErrorException {
    return new ErrorException(ErrorCodes.NOT_FOUND, message);
  }

  static invalidInput(message: string): ErrorException {
    return new ErrorException(ErrorCodes.BAD_REQUEST, message);
  }
}
