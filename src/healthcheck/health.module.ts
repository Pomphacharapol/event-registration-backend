import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus/dist/terminus.module';
import { HealthController } from './health.controller';

@Module({
  controllers: [HealthController],
  imports: [TerminusModule],
  providers: [],
})
export class HealthModule {}
