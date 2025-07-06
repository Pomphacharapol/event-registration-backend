import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTodoDto {
  @ApiProperty({
    description: 'todo title',
    example: 'Sleep',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'todo description',
    example: 'Sleep in the morning',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Creator name',
    example: 'Bo',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  creatorName: string;
}
