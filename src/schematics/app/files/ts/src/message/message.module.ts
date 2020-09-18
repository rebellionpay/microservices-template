import { Module, Global } from '@nestjs/common';
import { NATSConfigService } from '../config/NATSConfigService';
import { ClientProxyFactory } from '@nestjs/microservices';
import { MessageService } from './message.service';

@Global()
@Module({
  providers: [{
    provide: 'MESSAGE_CLIENT',
    useFactory: (natsConfigService: NATSConfigService) => ClientProxyFactory.create({ ...natsConfigService.getNATSConfig }),
    inject: [NATSConfigService]
  }, NATSConfigService, MessageService],
  exports: [MessageService]
})
export class MessageModule {};