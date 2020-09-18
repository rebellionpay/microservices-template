import { Controller<% if (pure) { %><% } else { %>, UseInterceptors<% } %> } from '@nestjs/common';
<% if (!pure) { %>import { MetricsInterceptor } from '../interceptors/MetricsInterceptor';
import { InjectMetadataInterceptor } from '../interceptors/InjectMetadataInterceptor';

@UseInterceptors(MetricsInterceptor, InjectMetadataInterceptor)<% } %>
@Controller('<%= dasherize(name) %>')
export class <%= classify(name) %>Controller {}