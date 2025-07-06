import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateTodoDto } from './create-todo.dto';

export class UpdateTodoDto extends PartialType(CreateTodoDto) {
  @ApiProperty({
    description: 'todo status',
    required: false,
    example: false,
  })
  statusActive: boolean;
}
