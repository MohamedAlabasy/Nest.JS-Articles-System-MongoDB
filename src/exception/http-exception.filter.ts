import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import { BASE_URL } from 'src/utilities/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const context = host.switchToHttp();
        const response = context.getResponse<Response>();
        const request = context.getRequest<Request>();
        const status = exception.getStatus();

        // to log an error on the console
        console.log('Exception Error URL :', BASE_URL + request.url);
        console.log('Exception Error status :', status);
        console.log('Exception Error :', exception.message);

        //         console.log(`{
        //     Exception Error URL : ${BASE_URL + request.url}
        //     Exception Error : ${exception.message}
        // }`);


        response.status(status).json({
            statusCode: status,
            message: exception.message,
            // timestamp: new Date().toISOString(),
            // path: request.url,
        });
    }
}