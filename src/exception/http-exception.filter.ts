import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import { BASE_URL, RED_COLOR, BASE_COLOR } from 'src/utilities/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const context = host.switchToHttp();
        const response = context.getResponse<Response>();
        const request = context.getRequest<Request>();
        const status = exception.getStatus();

        // to log an error on the console
        console.log(RED_COLOR + BASE_COLOR, '\nSTART OF Exception');
        console.log('url :', BASE_URL + request.url);
        console.log('status:', status);
        console.log('message:', exception.message);
        console.log(RED_COLOR + BASE_COLOR, 'END OF Exception');

        //         console.log(`{
        //     Exception Error URL : ${BASE_URL + request.url}
        //     Exception Error : ${exception.message}
        // }`);

        response.status(status).json({
            statusCode: status,
            message: exception['response'].message,
            error: exception['response'].error,
            // error: exception.message,
            // timestamp: new Date().toISOString(),
            // path: request.url,
        });
    }
}