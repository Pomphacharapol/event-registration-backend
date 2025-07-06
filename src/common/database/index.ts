import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { readFileSync } from 'fs';
import { DatabaseConfig } from '../config/database.config';

@Module({
  providers: [],
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
        const databaseConfig =
          configService.get<DatabaseConfig>('database-config');
        let extra = {};
        if (
          process.env.NODE_ENV !== 'local' &&
          process.env.NODE_ENV !== 'test'
        ) {
          extra = {
            ssl: {
              rejectUnauthorized: false,
            },
          };
        }

        const userPassword = readFileSync(databaseConfig.userPassword, {
          encoding: 'utf8',
        });
        const connectionString = databaseConfig.connectionString.replace(
          '${db-user-password}',
          function () {
            return userPassword;
          },
        );

        return {
          type: 'postgres',
          url: connectionString,
          entities: [],
          autoLoadEntities: true,
          extra: extra,
        };
      },
    }),
  ],
})
class DatabaseModule {}

export default DatabaseModule;
