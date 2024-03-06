import { NextFunction, Request, Response } from "express";

export enum HttpStatusCode {
  // Informational
  CONTINUE = 100,
  SWITCHING_PROTOCOLS = 101,
  PROCESSING = 102, // WebDAV

  // Success
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NON_AUTHORITATIVE_INFORMATION = 203,
  NO_CONTENT = 204,
  RESET_CONTENT = 205,
  PARTIAL_CONTENT = 206,
  MULTI_STATUS = 207, // WebDAV
  ALREADY_REPORTED = 208, // WebDAV
  IM_USED = 226, // RFC 3229

  // Redirection
  MULTIPLE_CHOICES = 300,
  MOVED_PERMANENTLY = 301,
  FOUND = 302,
  SEE_OTHER = 303,
  NOT_MODIFIED = 304,
  USE_PROXY = 305,
  TEMPORARY_REDIRECT = 307,
  PERMANENT_REDIRECT = 308,

  // Client Error
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  PAYMENT_REQUIRED = 402,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  NOT_ACCEPTABLE = 406,
  PROXY_AUTHENTICATION_REQUIRED = 407,
  REQUEST_TIMEOUT = 408,
  CONFLICT = 409,
  GONE = 410,
  LENGTH_REQUIRED = 411,
  PRECONDITION_FAILED = 412,
  PAYLOAD_TOO_LARGE = 413,
  URI_TOO_LONG = 414,
  UNSUPPORTED_MEDIA_TYPE = 415,
  RANGE_NOT_SATISFIABLE = 416,
  EXPECTATION_FAILED = 417,
  IM_A_TEAPOT = 418, // RFC 2324
  MISDIRECTED_REQUEST = 421, // RFC 7540
  UNPROCESSABLE_ENTITY = 422, // WebDAV
  LOCKED = 423, // WebDAV
  FAILED_DEPENDENCY = 424, // WebDAV
  UPGRADE_REQUIRED = 426,
  PRECONDITION_REQUIRED = 428, // RFC 6585
  TOO_MANY_REQUESTS = 429, // RFC 6585
  REQUEST_HEADER_FIELDS_TOO_LARGE = 431, // RFC 6585
  UNAVAILABLE_FOR_LEGAL_REASONS = 451,

  // Server Error
  INTERNAL_SERVER_ERROR = 500,
  NOT_IMPLEMENTED = 501,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504,
  HTTP_VERSION_NOT_SUPPORTED = 505,
  VARIANT_ALSO_NEGOTIATES = 506, // RFC 2295
  INSUFFICIENT_STORAGE = 507, // WebDAV
  LOOP_DETECTED = 508, // WebDAV
  NOT_EXTENDED = 510, // RFC 2774
  NETWORK_AUTHENTICATION_REQUIRED = 511, // RFC 6585
}

export class BaseError extends Error {
  public readonly httpCode: HttpStatusCode;

  constructor(httpCode: HttpStatusCode, name: string, message: string) {
    super(message);
    this.name = name;
    this.httpCode = httpCode;
    Error.captureStackTrace(this);
  }
}

export const catchAsync =
  (fn: any) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
  };

export const globalErrorHandler = async (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error: Error = err;

  if (process.env.NODE_ENV === "development") {
    if (error instanceof BaseError) {
      res
        .status(error.httpCode)
        .json({ name: error.name, message: error.message, stack: error.stack });
      return;
    }
    res.json({ error });
    return;
  }
  // for production error
  if (err.code === 11000) {
    error = handleDuplicateError(err);
  } else if (err.name === "JsonWebTokenError") {
    error = new BaseError(
      HttpStatusCode.BAD_REQUEST,
      "BAD_REQUEST",
      `Invalid jwt token`
    );
  }

  if (error instanceof BaseError) {
    res
      .status(error.httpCode)
      .json({ status: error.name, error: error.message });
    return;
  }
  res
    .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
    .json({ error: "something went wrong" });
};

const handleDuplicateError = (err: any) =>
  new BaseError(HttpStatusCode.CONFLICT, "Data exists", ` exist`);
