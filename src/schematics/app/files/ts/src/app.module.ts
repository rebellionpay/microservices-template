import { ConfigModule } from '@nestjs/config';
import { Module, DynamicModule } from '@nestjs/common';<% 
if (persistence && persistenceDB === 'mongodb') {
%>import { MongooseModule } from '@nestjs/mongoose';
import { MongoConfigService } from './config/MongoConfigService';<% 
} else if (persistence) { 
%>import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './config/TypeOrmConfigService';<% 
} %>
import { <%= transport %>ConfigService } from './config/<%= transport %>ConfigService';
import { object as JoiObject, string as JoiString, number as JoiNumber } from '@hapi/joi';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WinstonModule } from 'nest-winston';
import { LoggerConfig } from './factory/winstonConfig';
import { MetricsModule } from './metrics/metrics.module';
import { ApmModule } from 'elastic-apm-nest';
import { MessageModule } from './message/message.module';<% 
if (pure) { %>
import { MetricsInterceptor } from './interceptors/MetricsInterceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
<% } %>
const logger: LoggerConfig = new LoggerConfig();    

@Module({})
export class AppModule {
  public static register(): DynamicModule {
    const imports = [
      <% if (persistence && persistenceDB === 'mongodb') {
      %>MongooseModule.forRootAsync({
        useClass: MongoConfigService,
      }),
      <% } else if (persistence) { 
      %>TypeOrmModule.forRootAsync({
        useClass: TypeOrmConfigService,
      }),
      <% } 
      %>WinstonModule.forRoot(logger.console()),
      ConfigModule.forRoot({
        isGlobal: true,
        validationSchema: JoiObject({
          NODE_ENV: JoiString()
            .valid('development', 'production', 'test')
            .default('development'),
          PORT: JoiNumber().port().default(3030),
          ELASTIC_APM_SERVER_URL: JoiString(),
          ELASTIC_APM_SERVICE_NAME: JoiString(),
          ELASTIC_APM_SECRET_TOKEN: JoiString(),<% 
          if (transport === 'NATS' ) { %>
          NATS_URL: JoiString().required().default('nats://localhost:4222'),
          NATS_USER: JoiString(),
          NATS_PASSWORD: JoiString(),<% 
          } if (persistence && persistenceDB === 'mongodb') {%>
          MONGODB_URI: JoiString().uri().required(),
          <% } else if (persistence) {
          %>DB_HOST=localhost
          DB_PORT=3306
          DB_USERNAME=admin
          DB_PASSWORD=admin
          DB_DATABASE=test
          <% } 
          %>INFLUX_URL: JoiString().uri()
        })
      }),
      MetricsModule,
      MessageModule
    ];

    if(process.env.NODE_ENV === 'production') {
      imports.push(ApmModule.forRootAsync({
        useFactory: async () => {
          return {
            httpUserMapFunction: (req: any) => {
              return {
                ...req
              };
            },
          };
        },
      }));
    }

    const controllers = [AppController];

    const providers = [<%= transport %>ConfigService, AppService<% if(pure) { %>, {
        provide: APP_INTERCEPTOR,
        useClass: MetricsInterceptor,
      }
    <% } %>];

    return {
      module: AppModule,
      imports,
      controllers,
      providers,
    };
  }
}