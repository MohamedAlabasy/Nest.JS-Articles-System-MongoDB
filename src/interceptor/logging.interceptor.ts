import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BASE_URL, BASE_COLOR, MAGENTA_COLOR } from './../utilities/common';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

        console.log(MAGENTA_COLOR + BASE_COLOR, '\nSTART OF ROUTE');
        console.log('method :', context.switchToHttp().getRequest().method);
        console.log('url :', BASE_URL + context.switchToHttp().getRequest().url);
        
        const now = Date.now();
        return next.handle().pipe(tap(
            () => console.log(MAGENTA_COLOR + BASE_COLOR, `END OF ROUTE ... ${Date.now() - now} ms`)
        ),);
    }
}