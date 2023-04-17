import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();
    let status = !isNaN(exception.status)
      ? exception.status
      : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = '';
    if (exception.response?.message) {
      if (Array.isArray(exception.response.message)) {
        message = exception.response.message.join(', ');
      } else {
        message = exception.response.message;
      }
      status = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    if (exception.code === 11000) {
      const path = Object.keys(exception.keyPattern)[0];
      message = `${
        path.charAt(0).toUpperCase() + path.slice(1)
      } already exists!`;
      status = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    const errorResponse = {
      code: status,
      method: request.method,
      path: request.url,
      message,
    };

    Logger.error(
      `${request.method} ${request.path}`,
      JSON.stringify(errorResponse),
      'ExceptionFilter',
    );

    response.status(status).json({
      status: false,
      message: message ? message : exception.message,
    });
  }
}
