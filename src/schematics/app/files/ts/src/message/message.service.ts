import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { MicroserviceMessage } from '../interface/MicroserviceMessage';

@Injectable()
export class MessageService {
  constructor(@Inject('MESSAGE_CLIENT') private client: ClientProxy){};

  sendMessage<Toutput = any, Tinput = any>(pattern: Record<string, any> | string, message: MicroserviceMessage<Tinput>): Observable<Toutput> {
    return this.client.send<Toutput, MicroserviceMessage<Tinput>>(pattern, message);
  }

  emitMessage<Toutput = any, Tinput = any>(pattern: Record<string, any> | string, message: MicroserviceMessage<Tinput>): Observable<Toutput> {
    return this.client.emit<Toutput, MicroserviceMessage<Tinput>>(pattern, message);
  }
}
