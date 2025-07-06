import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class PaginationRequest {
  @ApiProperty({
    description: 'Page number if you use offset value dont input this field',
    required: false,
    default: 1,
  })
  @IsNumber()
  @Type(() => Number)
  page?: number = 1;

  @ApiProperty({
    description: 'Limit of result number',
    default: 20,
    maximum: 100,
    required: false,
  })
  @IsNumber()
  @Type(() => Number)
  limit?: number = 20;
}

export class PaginationMetaDto {
  @ApiProperty({
    description: 'total number of items',
    example: 60,
  })
  totalItems: number;

  @ApiProperty({
    description: 'number of item in response',
    example: 20,
  })
  itemCount: number;

  @ApiProperty({
    description: 'items per page (limit)',
    example: 20,
  })
  itemsPerPage: number;

  @ApiProperty({
    description: 'total page',
    example: 3,
  })
  totalPages: number;

  @ApiProperty({
    description: 'current page',
    example: 1,
  })
  currentPage: number;
}

export class PaginationResponseDto<T> {
  @ApiProperty({ description: 'Result of items' })
  items: T[];

  @ApiProperty({
    description: 'Meta data of pagination',
    type: PaginationMetaDto,
  })
  meta: PaginationMetaDto;
}
