import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsBooleanString,
  IsNotEmpty,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import { JoinTableValidator } from '../../common/validator';
import { GetTodoDto } from './get-todo.dto';

export class GetTodoWithJoinTable extends PartialType(GetTodoDto) {
  @ApiPropertyOptional({
    description: 'keyword for search',
    example: 'Sleep in the morning',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  searchKeyword?: string;

  @ApiPropertyOptional({
    description: 'flag to include data with join table 1 in the response',
    example: true,
  })
  @IsOptional()
  @IsBooleanString()
  isShowDataWithJoinTable1?: boolean;

  @ApiPropertyOptional({
    description: 'flag to include data with join table 2 in the response',
    example: true,
  })
  @IsOptional()
  @Validate(JoinTableValidator)
  @IsBooleanString()
  isShowDataWithJoinTable2?: boolean;
}
