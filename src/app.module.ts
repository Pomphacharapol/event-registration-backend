import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import {
  appConfig,
  certificateConfig,
  corsConfig,
  databaseConfig,
} from './common/config';
import DatabaseModule from './common/database';
import { RouteAuthorizationModule } from './common/guards/route-auth/route-auth.module';
import { HealthModule } from './healthcheck/health.module';
import { TodosModule } from './todos/todos.module';

const isAppEnableExampleModule =
  process.env.APP_ENABLE_EXAMPLE_MODULE === 'true';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `./environment/service/.env.${process.env.NODE_ENV}`,
      load: [appConfig, certificateConfig, corsConfig, databaseConfig],
      isGlobal: true,
    }),
    DatabaseModule,
    HealthModule,
    RouteAuthorizationModule,
    TodosModule.forRoot(isAppEnableExampleModule),
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
