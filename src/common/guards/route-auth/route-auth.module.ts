import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppLoggerModule } from '../../app-logger';
import { AutoIdModule } from '../../providers/auto-id/auto-id.module';

@Module({
  imports: [
    AppLoggerModule,
    AutoIdModule,
    PassportModule,
    TypeOrmModule.forFeature([]),
  ],
  providers: [],
  exports: [],
})
export class RouteAuthorizationModule {}
