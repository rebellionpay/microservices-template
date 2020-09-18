import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import * as path from 'path';
import * as inquirer from 'inquirer';
import { ApplicationOptions } from './application.schema';

describe('Application Factory', () => {
  const runner: SchematicTestRunner = new SchematicTestRunner(
    '.',
    path.join(process.cwd(), 'src/collection.json'),
  );

  beforeEach(() => {
    jest.clearAllMocks();
  })

  it('should manage name only', async () => {
    const options: ApplicationOptions = {
      name: 'project',
      transport: 'NATS',
      pure: true,
      persistence: false
    };

    jest.spyOn(inquirer, 'prompt').mockResolvedValueOnce(options);

    const tree: UnitTestTree = await runner.runSchematicAsync('app', options).toPromise<UnitTestTree>();
    const files: string[] = tree.files;
    expect(files).toEqual([
      '/project/.env.example',
      '/project/.eslintignore',
      '/project/.eslintrc.js',
      '/project/.gitignore',
      '/project/.gitlab-ci.yml',
      '/project/.prettierrc',
      '/project/README.md',
      '/project/nest-cli.json',
      '/project/package.json',
      '/project/tsconfig.build.json',
      '/project/tsconfig.json',
      '/project/.vscode/launch.json',
      '/project/src/app.controller.spec.ts',
      '/project/src/app.controller.ts',
      '/project/src/app.module.ts',
      '/project/src/app.service.ts',
      '/project/src/main.ts',
      '/project/src/config/NATSConfigService.ts',
      '/project/src/factory/winstonConfig.ts',
      '/project/src/interceptors/InjectMetadataInterceptor.ts',
      '/project/src/interceptors/MetricsInterceptor.ts',
      '/project/src/interceptors/TimeoutInterceptor.ts',
      '/project/src/interface/MicroserviceMessage.ts',
      '/project/src/message/message.module.ts',
      '/project/src/message/message.service.spec.ts',
      '/project/src/message/message.service.ts',
      '/project/src/metrics/metrics.module.ts',
      '/project/src/metrics/metrics.service.ts',
      '/project/test/app.e2e-spec.ts',
      '/project/test/jest-e2e.json',
    ]);
  });
  it('should manage name to dasherize', async () => {
    const options: ApplicationOptions = {
      name: 'awesomeProject',
      transport: 'NATS',
      pure: true,
      persistence: false
    };

    jest.spyOn(inquirer, 'prompt').mockResolvedValueOnce(options);

    const tree: UnitTestTree = await runner.runSchematicAsync('app', options).toPromise<UnitTestTree>();
    const files: string[] = tree.files;
    expect(files).toEqual([
      '/awesome-project/.env.example',
      '/awesome-project/.eslintignore',
      '/awesome-project/.eslintrc.js',
      '/awesome-project/.gitignore',
      '/awesome-project/.gitlab-ci.yml',
      '/awesome-project/.prettierrc',
      '/awesome-project/README.md',
      '/awesome-project/nest-cli.json',
      '/awesome-project/package.json',
      '/awesome-project/tsconfig.build.json',
      '/awesome-project/tsconfig.json',
      '/awesome-project/.vscode/launch.json',
      '/awesome-project/src/app.controller.spec.ts',
      '/awesome-project/src/app.controller.ts',
      '/awesome-project/src/app.module.ts',
      '/awesome-project/src/app.service.ts',
      '/awesome-project/src/main.ts',
      '/awesome-project/src/config/NATSConfigService.ts',
      '/awesome-project/src/factory/winstonConfig.ts',
      '/awesome-project/src/interceptors/InjectMetadataInterceptor.ts',
      '/awesome-project/src/interceptors/MetricsInterceptor.ts',
      '/awesome-project/src/interceptors/TimeoutInterceptor.ts',
      '/awesome-project/src/interface/MicroserviceMessage.ts',
      '/awesome-project/src/message/message.module.ts',
      '/awesome-project/src/message/message.service.spec.ts',
      '/awesome-project/src/message/message.service.ts',
      '/awesome-project/src/metrics/metrics.module.ts',
      '/awesome-project/src/metrics/metrics.service.ts',
      '/awesome-project/test/app.e2e-spec.ts',
      '/awesome-project/test/jest-e2e.json',
    ]);
  });

  it('should manage destination directory', async () => {
    const options: ApplicationOptions = {
      name: '@scope/package',
      directory: 'scope-package',
      transport: 'NATS',
      pure: true,
      persistence: false
    };

    jest.spyOn(inquirer, 'prompt').mockResolvedValueOnce(options);

    const tree: UnitTestTree = await runner.runSchematicAsync('app', options).toPromise<UnitTestTree>();
    const files: string[] = tree.files;
    expect(files).toEqual([
      '/scope-package/.env.example',
      '/scope-package/.eslintignore',
      '/scope-package/.eslintrc.js',
      '/scope-package/.gitignore',
      '/scope-package/.gitlab-ci.yml',
      '/scope-package/.prettierrc',
      '/scope-package/README.md',
      '/scope-package/nest-cli.json',
      '/scope-package/package.json',
      '/scope-package/tsconfig.build.json',
      '/scope-package/tsconfig.json',
      '/scope-package/.vscode/launch.json',
      '/scope-package/src/app.controller.spec.ts',
      '/scope-package/src/app.controller.ts',
      '/scope-package/src/app.module.ts',
      '/scope-package/src/app.service.ts',
      '/scope-package/src/main.ts',
      '/scope-package/src/config/NATSConfigService.ts',
      '/scope-package/src/factory/winstonConfig.ts',
      '/scope-package/src/interceptors/InjectMetadataInterceptor.ts',
      '/scope-package/src/interceptors/MetricsInterceptor.ts',
      '/scope-package/src/interceptors/TimeoutInterceptor.ts',
      '/scope-package/src/interface/MicroserviceMessage.ts',
      '/scope-package/src/message/message.module.ts',
      '/scope-package/src/message/message.service.spec.ts',
      '/scope-package/src/message/message.service.ts',
      '/scope-package/src/metrics/metrics.module.ts',
      '/scope-package/src/metrics/metrics.service.ts',
      '/scope-package/test/app.e2e-spec.ts',
      '/scope-package/test/jest-e2e.json',
    ]);
  });

  it('should generate exception filter when not a pure app', async () => {
    const options: ApplicationOptions = {
      name: 'project',
      transport: 'NATS',
      pure: false,
      persistence: false
    };

    jest.spyOn(inquirer, 'prompt').mockResolvedValueOnce(options);

    const tree: UnitTestTree = await runner.runSchematicAsync('app', options).toPromise<UnitTestTree>();
    const files: string[] = tree.files;

    expect(files.find(file => file === '/project/src/filters/ExceptionsFilter.ts'))
  })

  it('should generate mongo config service when persistence is mongo', async () => {
    const options: ApplicationOptions = {
      name: 'project',
      transport: 'NATS',
      pure: false,
      persistence: true,
      persistenceDB: 'mongodb'
    };

    jest.spyOn(inquirer, 'prompt').mockResolvedValueOnce(options);

    const tree: UnitTestTree = await runner.runSchematicAsync('app', options).toPromise<UnitTestTree>();
    const files: string[] = tree.files;

    expect(files.find(file => file === '/project/src/config/MongoConfigService.ts'))
  })

  it('should generate typeorm config service when persistence is mongo', async () => {
    const options: ApplicationOptions = {
      name: 'project',
      transport: 'NATS',
      pure: false,
      persistence: true,
      persistenceDB: 'postgresql'
    };

    jest.spyOn(inquirer, 'prompt').mockResolvedValueOnce(options);

    const tree: UnitTestTree = await runner.runSchematicAsync('app', options).toPromise<UnitTestTree>();
    const files: string[] = tree.files;

    expect(files.find(file => file === '/project/src/config/TypeOrmConfigService.ts'))
  })

  it('should create an hybrid app when pure is set to false', async () => {
    const options: ApplicationOptions = {
      name: 'project',
      transport: 'NATS',
      pure: false,
      persistence: true,
      persistenceDB: 'postgresql'
    };

    jest.spyOn(inquirer, 'prompt').mockResolvedValueOnce(options);

    const tree: UnitTestTree = await runner.runSchematicAsync('app', options).toPromise<UnitTestTree>();

    expect(tree.readContent('/project/src/main.ts').replace('\t', '')).toEqual(
      "import { NestFactory } from '@nestjs/core';\n" +
      "import { AppModule } from './app.module';\n" +
      "import helmet from 'helmet';\n" +
      "import { ConfigService } from '@nestjs/config';\n" +
      "import { AllExceptionsFilter } from './filters/ExceptionsFilter';\n" +
      "import { NATSConfigService } from './config/NATSConfigService';\n" +
      "import { TimeoutInterceptor } from './interceptors/TimeoutInterceptor';\n" +
      "import { WinstonModule } from 'nest-winston';\n" +
      "import { LoggerConfig } from './factory/winstonConfig';\n" +
      "import { APM_MIDDLEWARE, ApmHttpUserContextInterceptor, ApmErrorInterceptor, initializeAPMAgent } from 'elastic-apm-nest';\n" +
      '\n' +
      "if (process.env.NODE_ENV === 'production') {\n" +
      '  initializeAPMAgent({\n' +
      '    serverUrl: process.env.ELASTIC_APM_SERVER_URL,\n' +
      '    serviceName: process.env.ELASTIC_APM_SERVICE_NAME,\n' +
      '    secretToken: process.env.ELASTIC_APM_SECRET_TOKEN,\n' +
      '  });\n' +
      '}\n' +
      '\n' +
      'async function bootstrap() {\n' +
      '  const logger: LoggerConfig = new LoggerConfig();\n' +
      '  const winstonLogger = WinstonModule.createLogger(logger.console());\n' +
      '\n' +
      '  const app = await NestFactory.create(\n' +
      '    AppModule.register(),\n' +
      '    {\n' +
      '      cors: true,\n' +
      '      logger: WinstonLogger\n' +
      '    }\n' +
      '  );\n' +
      '\n' +
      '  const natsConfigService : NATSConfigService = app.get(NATSConfigService);\n' +
      '  const configService : ConfigService = app.get<ConfigService>(ConfigService);\n' +
      '  \n' +
      '  app.use(helmet());\n' +
      '  app.useGlobalInterceptors(new TimeoutInterceptor());\n' +
      '  app.useGlobalFilters(new AllExceptionsFilter);\n' +
      '\n' +
      '\n' +
      '  app.connectMicroservice({\n' +
      '    ...natsConfigService.getNATSConfig\n' +
      '  });\n' +
      '\n' +
      '  const globalInterceptors = [];\n' +
      '\n' +
      "  if (process.env.NODE_ENV === 'production') {\n" +
      '    globalInterceptors.push(\n' +
      '      app.get(ApmHttpUserContextInterceptor),\n' +
      '      app.get(ApmErrorInterceptor)\n' +
      '    );\n' +
      '    const apmMiddleware = app.get(APM_MIDDLEWARE);\n' +
      '    app.use(apmMiddleware);\n' +
      '  }\n' +
      '\n' +
      '  globalInterceptors.push(\n' +
      '    new TimeoutInterceptor()\n' +
      '  );\n' +
      '  app.useGlobalInterceptors(... globalInterceptors);\n' +
      '\n' +
      "  const port = configService.get<number>('PORT') || 3000;\n" +
      '  app.startAllMicroservicesAsync();\n' +
      '\n' +
      '  await app.listen(port, () => winstonLogger.log(`Hybrid project test running on port ${port}`));\n' +
      '\n' +
      '}\n' +
      'bootstrap();\n'
    )
  })

  it('should create a pure microservice app when pure is set to true', async () => {
    const options: ApplicationOptions = {
      name: 'project',
      transport: 'NATS',
      pure: true,
      persistence: false,
    };

    jest.spyOn(inquirer, 'prompt').mockResolvedValueOnce(options);

    const tree: UnitTestTree = await runner.runSchematicAsync('app', options).toPromise<UnitTestTree>();

    expect(tree.readContent('/project/src/main.ts').replace('\t', '')).toEqual(
      "import { NestFactory } from '@nestjs/core';\n" +
      "import { AppModule } from './app.module';\n" +
      "import { NATSConfigService } from './config/NATSConfigService';\n" +
      "import { TimeoutInterceptor } from './interceptors/TimeoutInterceptor';\n" +
      "import { InjectMetadataInterceptor } from './interceptors/InjectMetadataInterceptor';\n" +
      "import { WinstonModule } from 'nest-winston';\n" +
      "import { LoggerConfig } from './factory/winstonConfig';\n" +
      "import { ApmErrorInterceptor, initializeAPMAgent } from 'elastic-apm-nest';\n" +
      '\n' +
      "if (process.env.NODE_ENV === 'production') {\n" +
      '  initializeAPMAgent({\n' +
      '    serverUrl: process.env.ELASTIC_APM_SERVER_URL,\n' +
      '    serviceName: process.env.ELASTIC_APM_SERVICE_NAME,\n' +
      '    secretToken: process.env.ELASTIC_APM_SECRET_TOKEN,\n' +
      '  });\n' +
      '}\n' +
      '\n' +
      'async function bootstrap() {\n' +
      '  const logger: LoggerConfig = new LoggerConfig();\n' +
      '  const winstonLogger = WinstonModule.createLogger(logger.console());\n' +
      '\n' +
      '  const context = await NestFactory.createApplicationContext(AppModule.register(), {\n' +
      '    logger: winstonLogger\n' +
      '  });\n' +
        '\n' +
      '  const natsConfigService : NATSConfigService = context.get(NATSConfigService);\n' +
        '\n' +
      '  context.close();\n' +
        '\n' +
      '  const app = await NestFactory.createMicroservice(AppModule.register(), {\n' +
      '    ...natsConfigService.getNATSConfig,\n' +
      '    logger: winstonLogger\n' +
      '  });\n' +
        '\n' +
      '  const globalInterceptors = [\n' +
      '    new TimeoutInterceptor(),\n' +
      '    new InjectMetadataInterceptor()\n' +
      '  ];\n' +
        '\n' +
      "  if(process.env.NODE_ENV === 'production') {\n" +
      '    globalInterceptors.push(app.get(ApmErrorInterceptor));\n' +
      '  }\n' +
        '\n' +
      '  app.useGlobalInterceptors(...globalInterceptors);\n' +
        '\n' +
      "  app.listen(() => winstonLogger.log('Microservice project running'));\n" +
      '\n' +
      '}\n' +
      'bootstrap();\n'
    )
  })
});
