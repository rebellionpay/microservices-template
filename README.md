# Instalation and usage
tl;dr;
```bash
npm i -g @rebellionpay/nest-ms-template

# For generating an app
nest g -c @rebellionpay/nest-ms-template app

# For generating a controller
nest g -c @rebellionpay/nest-ms-template ctlr
```
# What is this project?

This project is a schematic for generating NestJS projects. The CLI support custom schematics and that's what we have done here.

## Scope

This project is done by [RebellionPay](https://rebellionpay.com/) and for covering the needs of RebellionPay. If this can help someone else, that would be great! But the main purpose of this package is to build a pave road for Rebellion dev team.

## Usage

For using this as a collection for NestJS CLI you have to install this packages globally first:

```bash
npm i -g @rebellionpay/nest-ms-template
```

Then you can refer to the package from the nest CLI with:

```bash
# For generating an app
nest g -c @rebellionpay/nest-ms-template app

# For generating a controller
nest g -c @rebellionpay/nest-ms-template ctlr
```

### Generating an app

If you generate an app, the available parameters are (will be asqued at runtime):

| Name                | Type    | Optional | Default                                 | Description                                                                                                                 |
|---------------------|---------|----------|-----------------------------------------|-----------------------------------------------------------------------------------------------------------------------------|
| name                | string  | No       | -                                       | The app name. Used in the code and in the folder name                                                                       |
| port                | number  | No       | 3000                                    | The application port                                                                                                        |
| author              | string  | Yes      | RebellionPay <backend@rebellionpay.com> | The project author. Appears in package.json                                                                                 |
| description         | string  | Yes      | -                                       | The project description. Appears in package.json                                                                            |
| license             | string  | Yes      | MIT                                     | The project license. Appears in package.json                                                                                |
| transport           | string  | No       | NATS                                    | The messaging transport to use with NestJS. Right now only NATS is supported                                                |
| pure                | boolean | No       | false                                   | Whether the app is a pure or an hybird one. Refer to NestJS [documentation](https://docs.nestjs.com/faq/hybrid-application) |
| persistence         | boolean | No       | true                                    | Whether the app is going to have persistence or not                                                                         |
| persistenceDB       | string  | Yes      | -                                       | The DB to generate configuration for. Available options are mongodb, postgresql, mysql and other                            |
| useSpinnaker        | boolean | No       | true                                    | This will include (or not) a step in the gitlab-ci file for notifying spinnaker when an image is pushed                     |
| spinnakerUrl        | string  | Yes      | -                                       | The spinnaker API url for sending the notification to                                                                       |
| kubernetesNamespace | string  | No       | default                                 | The kubernetes namespace that will appear in the manifest                                                                   |

### Example result

For an execution with the following answers:

```
? What name would you like to use for the new project? testing
? In which port will it run? 3000
? Which transport layer would you like to use? NATS
? Are you building a pure app? No
? Are you going to use persistence in a DB? Yes
? Which database would you like to use? mongodb
? Are you going to make the CD with spinnaker? No
? In which kubernetes namespace will this app going to be deployed? default
```
The generated tree will be:

```
.
├── README.md
├── kubernetes
│   └── manifest.yml
├── nest-cli.json
├── package.json
├── src
│   ├── app.controller.spec.ts
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   ├── config
│   │   ├── MongoConfigService.ts
│   │   └── NATSConfigService.ts
│   ├── factory
│   │   └── winstonConfig.ts
│   ├── filters
│   │   └── ExceptionsFilter.ts
│   ├── interceptors
│   │   ├── InjectMetadataInterceptor.ts
│   │   ├── MetricsInterceptor.ts
│   │   └── TimeoutInterceptor.ts
│   ├── interface
│   │   └── MicroserviceMessage.ts
│   ├── main.ts
│   ├── message
│   │   ├── message.module.ts
│   │   ├── message.service.spec.ts
│   │   └── message.service.ts
│   └── metrics
│       ├── metrics.module.ts
│       └── metrics.service.ts
├── test
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
├── tsconfig.build.json
└── tsconfig.json
```

## Developing

If you want to extend or customize the schematics you have to checkout the project and install the dependencies:

```bash
npm i
```

Then, you can do whatever changes you need to the schematics and, for testing your changes you should first build it:

```bash
npm run build
```

And then youn can refer to the project root folder as schematic for nest CLI:

```
nest g -c ./nestjs-microservice-template-project app