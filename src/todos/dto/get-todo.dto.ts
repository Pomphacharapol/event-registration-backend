import { ApiProperty, PartialType } from '@nestjs/swagger';
import { PaginationRequest } from '../../common/decorators/typeorm-paginate';

export class GetTodoDto extends PartialType(PaginationRequest) {
  @ApiProperty({
    description: 'todo status',
    required: false,
    example: false,
  })
  statusActive?: boolean;
}
