import { Module } from '@nestjs/common';
import { AppLoggerService } from './app-logger.service';

@Module({
  exports: [AppLoggerService],
  providers: [AppLoggerService],
})
export class AppLoggerModule {}
