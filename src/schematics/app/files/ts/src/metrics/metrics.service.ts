import { Injectable } from '@nestjs/common';
import * as Influx from 'influx';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MetricsService {
  constructor( private configService: ConfigService) { }

  private influx = new Influx.InfluxDB(this.configService.get<string>('INFLUX_URL') || 'http://localhost:8086/telegraf');

  async send(measurement: string, fields: Record<string, any>): Promise<void> {
    this.influx.writePoints([{
      measurement,
      fields
    }]);
  }
}
