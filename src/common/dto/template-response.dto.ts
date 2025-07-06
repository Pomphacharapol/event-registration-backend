import { ApiProperty } from '@nestjs/swagger';

export class ResponseStatusDto {
  @ApiProperty({
    default: 'S0200',
    description: 'Status code',
    required: true,
    type: String,
  })
  code: string;

  @ApiProperty({
    default: 'Success',
    description: 'Status message',
    required: true,
    type: String,
  })
  message: string;

  @ApiProperty({
    description: 'Meta is an optional field for display an error data',
    required: false,
  })
  meta?: any;

  @ApiProperty({
    description: 'Stacktrace ia anoptional field for display error stacktrace',
    required: false,
  })
  stack?: any;
}

export class ResponseTemplateDto<T> {
  @ApiProperty({
    description: 'response status',
    required: true,
    type: ResponseStatusDto,
  })
  status: ResponseStatusDto;

  @ApiProperty({ description: 'Response data' })
  data?: T;
}
