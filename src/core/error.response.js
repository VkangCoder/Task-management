`use strict`;

const StatusCode = {
  FORBIDDEN: 403,
  CONFLICT: 409,
  BADREQUEST: 400,
  UNAUTHORIZED: 401,
  NOTFOUND: 404,
};
const ReasonStatusCode = {
  BADREQUEST: "Bad Request Error",
  CONFLICT: "Conflict Error",
  UNAUTHORIZED: "Unauthorized Error",
  NOTFOUND: "Not Found Error",
  FORBIDDEN: "Lỗi quyền",
};
class ErrorResponse extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

class ConflictRequestError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode.CONFLICT,
    statusCode = StatusCode.CONFLICT
  ) {
    super(message, statusCode);
  }
}
class BadRequestError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode.BADREQUEST,
    statusCode = StatusCode.BADREQUEST
  ) {
    super(message, statusCode);
  }
}
class UnauthorizedError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode.UNAUTHORIZED,
    statusCode = StatusCode.UNAUTHORIZED
  ) {
    super(message, statusCode);
  }
}
class NotFoundError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode.NOTFOUND,
    statusCode = StatusCode.NOTFOUND
  ) {
    super(message, statusCode);
  }
}
class FORBIDDEN extends ErrorResponse {
  constructor(
    message = ReasonStatusCode.FORBIDDEN,
    statusCode = StatusCode.FORBIDDEN
  ) {
    super(message, statusCode);
  }
}
module.exports = {
  BadRequestError,
  ConflictRequestError,
  UnauthorizedError,
  NotFoundError,
  FORBIDDEN,
};
