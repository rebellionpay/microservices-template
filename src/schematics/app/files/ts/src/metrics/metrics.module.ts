import { Module, Global } from '@nestjs/common';
import { MetricsService } from './metrics.service';

@Global()
@Module({
  imports: [],
  providers: [MetricsService],
  exports: [MetricsService]
})
export class MetricsModule { }
