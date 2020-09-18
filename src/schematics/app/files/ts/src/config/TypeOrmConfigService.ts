import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory{
  constructor(private configService: ConfigService) { }
  
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {<% 
      if (persistence && persistenceDB === 'postgresql') { 
      %>
      type: 'postgres',<% 
      } else if (persistence && persistenceDB === 'mysql') { 
      %>
      type: 'mysql',<% 
      }
      %>
      host: this.configService.get<string>('DB_HOST') || '',
      port: this.configService.get<number>('DB_PORT') || 1,
      username: this.configService.get<string>('DB_USERNAME') || '',
      password: this.configService.get<string>('DB_PASSWORD') || '',
      database: this.configService.get<string>('DB_DATABASE') || '',
      synchronize: true,
      keepConnectionAlive: true,
      retryAttempts: 5,
      retryDelay: 1000
    };
  };
}
