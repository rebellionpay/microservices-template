import { Injectable, Inject, NestInterceptor, ExecutionContext, CallHandler, HttpException } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { tap, catchError, finalize } from 'rxjs/operators';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { MetricsService } from '../metrics/metrics.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  constructor(
    @Inject('MetricsService') private readonly metrics: MetricsService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly configService: ConfigService
  ) { };

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const timeDate = Date.now();
    const income: any = context.getArgs();
    const type = context.getType();
    if (type === 'http') {
      const request = context.switchToHttp().getRequest();
      const reqId = request.headers['x-request-id'];
      const method = request.method;
      const path = request.route.path;
      const info = { reqId, path };
      let responseTime = -1;

      return next.handle().pipe(
        tap(() => {
          const response = context.switchToHttp().getResponse();
          responseTime = Date.now() - timeDate;

          this.logger.info(`[HTTP] | ${response.statusCode} | [${method}] ${path} - ${responseTime}ms`, info);
        }),
        catchError((error) => {
          this.logger.error(`[HTTP] | Error ${error}`, info);
          responseTime = Date.now() - timeDate;

          let status = 500;

          if (error instanceof HttpException) {
            status = error.getStatus();
          }

          this.logger.error(`[HTTP] | ${status} | [${method}] ${path} - ${responseTime}ms`, info);

          return throwError(error);
        }),
        finalize(() => {
          if (this.configService.get<string>('NODE_ENV') === 'production') {
            const response = context.switchToHttp().getResponse();
            const statusCode = response.statusCode;

            this.metrics.send('responseTime',
              {
                ms: '<%= name >',
                statusCode,
                method,
                path,
                value: responseTime
              }
            ).catch(err => {
              this.logger.error(`[METRICS] | Error sending metrics ${err}`, info);
            });
          }
        }),
      );
    } else if (type === 'rpc') {
      let natsTopic = { cmd: 'unknown' };
      const info = {
        reqId: income[0]?.metadata?.reqId || ''
      };
      try {
        natsTopic = JSON.parse(income[1].args[0]);
      } catch (err) {
        natsTopic = { cmd: income[1].args[0] };
      }

      this.logger.info(`[RPC] | in ${JSON.stringify(income[0])} ${JSON.stringify(natsTopic)}`, info);
      return next
        .handle()
        .pipe(
          tap((result) => {
            this.logger.info(`[RPC] | out ${JSON.stringify(result)} ${JSON.stringify(income)}`, info);
          }),
          catchError((err) => {
            this.logger.error(`[RPC] | Error ${err}`, info);

            return throwError(err);
          }),
          finalize(() => {
            if (this.configService.get<string>('NODE_ENV') === 'production') {
              this.metrics.send('responseTime',
                { ms: '<%= name >', ...natsTopic, value: Date.now() - timeDate }
              ).catch(err => {
                this.logger.error(`[METRICS] | Error sending metrics ${err}`, info);
              });
            }
          }),
        );
    }
    return next.handle();
  }
}