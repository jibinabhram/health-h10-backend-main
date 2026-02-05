import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();
    const req = ctx.getRequest();

    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException ? exception.getResponse() : 'Internal server error';

    try {
      const fs = require('fs');
      const logMsg = `[${new Date().toISOString()}] ${status} - ${JSON.stringify(message)} - ${req.url}\n`;
      fs.appendFileSync('error-logs.txt', logMsg);
    } catch (e) {
      console.error('Failed to write log file', e);
    }

    console.error(`🔥 [AllExceptionsFilter] Exception [${status}]:`, JSON.stringify(message));
    if (!(exception instanceof HttpException)) {
      console.error('🔥 [AllExceptionsFilter] Original Exception:', exception);
    }

    res.status(status).json({
      success: false,
      statusCode: status,
      message,
      path: req.url,
      timestamp: new Date().toISOString(),
    });
  }
}
