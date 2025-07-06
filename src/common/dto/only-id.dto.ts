import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiPropertyExampleConstant } from '../constant';

export class OnlyIDParamDto {
  @ApiProperty({
    default: ApiPropertyExampleConstant.NANO_ID,
    description: 'id',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  id: string;
}
