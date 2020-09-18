import { Controller, Inject<% if (!pure) { %>, Get, Post, Body, Headers, UseInterceptors<% } %> } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { MicroserviceMessage } from './interface/MicroserviceMessage';
import { AppService } from './app.service';
<% if (!pure) { %>import { MessageService } from './message/message.service';
import { MetricsInterceptor } from './interceptors/MetricsInterceptor';
import { InjectMetadataInterceptor } from './interceptors/InjectMetadataInterceptor';

@UseInterceptors(MetricsInterceptor, InjectMetadataInterceptor)<% } %>
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    <% if (!pure) { %>private readonly messageService: MessageService,
    <% } %>@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) { }

  @MessagePattern({ cmd: 'YOUR_CMD' })
  yourMessageHandler(@Payload() message: MicroserviceMessage): Record<string, unknown> {
    this.logger.info(message.data, message.metadata);
    return { data: message.data, metadata: message.metadata };
  }
<% if (!pure) { %>
  @Post()
  async yourPostHandler(
    @Body() body: Record<string, any>,
    @Headers('x-request-id') reqId: string
  ): Promise<unknown> {
    this.logger.info({ body, reqId });
    const response = await this.messageService.sendMessage({ cmd: 'YOUR_CMD' }, { data: body, metadata: { reqId } });
    return (await response.toPromise()).data;
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }<% } %>
}
