import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';<% 
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
import { LoggerConfig } from './factory/winstonConfig';
import { WinstonModule } from 'nest-winston';
import { MetricsModule } from './metrics/metrics.module';
import { MessageModule } from './message/message.module';<%
if (pure) { %>
import { MetricsInterceptor } from './interceptors/MetricsInterceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
<% } else { %>
import { MessageService } from './message/message.service';
<% } 
%>import { of } from 'rxjs';

describe('AppController', () => {
  let appController: AppController;<% 
  if (!pure) {%>
  let messageService: MessageService;<% 
  } %>
  let app: TestingModule;
  const logger: LoggerConfig = new LoggerConfig();

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [
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
      ],
      controllers: [AppController],
      providers: [<%= transport %>ConfigService, AppService<% if(pure) { %>, {
          provide: APP_INTERCEPTOR,
          useClass: MetricsInterceptor,
        }
      <% } %>],
    }).compile();

    appController = app.get<AppController>(AppController);<% 
    if (!pure) {%>
    messageService = app.get<MessageService>(MessageService);<% 
    } %>
    appController = app.get<AppController>(AppController);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('youtMessageHandler', () => {
    it('should return same data as passed', () => {
      const data = {
        data: 'test',
        metadata: 'metadata'
      };
      expect(appController.yourMessageHandler(data)).toEqual(data);
    });
  });
  <% if (!pure) { %>
  describe('yourPostHandler', () => {
    it('should return data returned by sendMessage', async () => {
      const data = 'test';
      jest.spyOn(messageService, 'sendMessage').mockImplementation(() => {
        return of({
          data
        });
      });

      const response = await appController.yourPostHandler({}, 'test');

      expect(response).toBe(data);
    });
  });

  describe('getHello', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
  <% } %>

  afterAll(async () => {
    if(app) {
      await app.close();
    }
  });
});
