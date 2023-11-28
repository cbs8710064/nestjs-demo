import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { QueryFailedError, TypeORMError } from 'typeorm';

@Catch(TypeORMError)
export class TypeormFilter implements ExceptionFilter {
  catch(exception: TypeORMError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    // 响应 请求对象
    const response = ctx.getResponse();
    // const request = Pctx.getRequest();
    let code = 500;
    if (exception instanceof QueryFailedError) {
      code = exception.driverError.errno;
    }
    // http状态码
    response.status(500).json({
      code,
      timestamp: new Date().toISOString(),
      message: exception.message,
    });
  }
}
