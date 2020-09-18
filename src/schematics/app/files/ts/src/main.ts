import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
<% if (!pure) 
{%>import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';
import { AllExceptionsFilter } from './filters/ExceptionsFilter';
<% } %>import { <%= transport %>ConfigService } from './config/<%= transport %>ConfigService';
import { TimeoutInterceptor } from './interceptors/TimeoutInterceptor';
<%
if (pure) { %>import { InjectMetadataInterceptor } from './interceptors/InjectMetadataInterceptor';
<% } 
%>import { WinstonModule } from 'nest-winston';
import { LoggerConfig } from './factory/winstonConfig';
import { <% if (!pure) {%>APM_MIDDLEWARE, ApmHttpUserContextInterceptor, <%}%>ApmErrorInterceptor, initializeAPMAgent } from 'elastic-apm-nest';

if (process.env.NODE_ENV === 'production') {
  initializeAPMAgent({
    serverUrl: process.env.ELASTIC_APM_SERVER_URL,
    serviceName: process.env.ELASTIC_APM_SERVICE_NAME,
    secretToken: process.env.ELASTIC_APM_SECRET_TOKEN,
  });
}

async function bootstrap() {
  const logger: LoggerConfig = new LoggerConfig();
  const winstonLogger = WinstonModule.createLogger(logger.console());

  <% if (pure) { 
  %>const context = await NestFactory.createApplicationContext(AppModule.register(), {
    logger: winstonLogger
  });

  const <%= decamelize(transport) %>ConfigService : <%= transport %>ConfigService = context.get(<%= transport %>ConfigService);

  context.close();

  const app = await NestFactory.createMicroservice(AppModule.register(), {
    ...<%= decamelize(transport) %>ConfigService.get<%= transport %>Config,
    logger: winstonLogger
  });

  const globalInterceptors = [
    new TimeoutInterceptor(),
    new InjectMetadataInterceptor()
  ];

  if(process.env.NODE_ENV === 'production') {
    globalInterceptors.push(app.get(ApmErrorInterceptor));
  }

  app.useGlobalInterceptors(...globalInterceptors);

  app.listen(() => winstonLogger.log('Microservice <%= name %> running'));
<% } else { 
  %>const app = await NestFactory.create(
    AppModule.register(),
    {
      cors: true,
      logger: WinstonLogger
    }
  );

  const <%= decamelize(transport) %>ConfigService : <%= transport %>ConfigService = app.get(<%= transport %>ConfigService);
  const configService : ConfigService = app.get<ConfigService>(ConfigService);
  
  app.use(helmet());
  app.useGlobalInterceptors(new TimeoutInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter);


  app.connectMicroservice({
    ...<%= decamelize(transport) %>ConfigService.get<%= transport %>Config
  });

  const globalInterceptors = [];

  if (process.env.NODE_ENV === 'production') {
    globalInterceptors.push(
      app.get(ApmHttpUserContextInterceptor),
      app.get(ApmErrorInterceptor)
    );
    const apmMiddleware = app.get(APM_MIDDLEWARE);
    app.use(apmMiddleware);
  }

  globalInterceptors.push(
    new TimeoutInterceptor()
  );
  app.useGlobalInterceptors(... globalInterceptors);

  const port = configService.get<number>('PORT') || 3000;
  app.startAllMicroservicesAsync();

  await app.listen(port, () => winstonLogger.log(`Hybrid <%= name %> test running on port ${port}`));
<% } %>
}
bootstrap();
