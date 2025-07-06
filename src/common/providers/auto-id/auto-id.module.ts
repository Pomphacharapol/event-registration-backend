import { Module } from '@nestjs/common';
import { AutoIdService } from './auto-id.service';

@Module({
  exports: [AutoIdService],
  providers: [AutoIdService],
})
export class AutoIdModule {}
