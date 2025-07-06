import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { HttpStatusCode } from 'axios';
import {
  ApiCreatedTemplateResponse,
  ApiDefaultErrorsTemplateResponse,
  ApiOkTemplateResponse,
} from '../common/decorators/response-template';
import { ApiPaginatedTemplateResponse } from '../common/decorators/typeorm-paginate/decorator';
import { OnlyIDParamDto } from '../common/dto';
import {
  CreateTodoDto,
  GetTodoDto,
  GetTodoWithJoinTable,
  UpdateTodoDto,
} from './dto';
import { Todo } from './entities/todo.entity';
import { TodoService } from './todos.service';

@Controller('todos')
@ApiTags('Todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @ApiOperation({
    summary: 'Create todo',
    description: 'Create a new todo',
  })
  @ApiDefaultErrorsTemplateResponse({
    disableBadRequest: true,
    disableDuplicateUser: true,
    disableForbidden: true,
    disableNotFound: true,
    disableTooManyRequests: true,
    disableUnauthorized: true,
    disableUnprocessable: true,
  })
  @ApiCreatedTemplateResponse({
    model: Todo,
    description: 'Response created todo data',
  })
  @HttpCode(HttpStatusCode.Created)
  @Post()
  create(@Body() createTodoDto: CreateTodoDto) {
    return this.todoService.create(createTodoDto);
  }

  @ApiOperation({
    summary: 'Get todo list',
    description: 'Filter todo list with statusActive',
  })
  @ApiPaginatedTemplateResponse({ model: Todo })
  @Get()
  findAll(@Query() queryPayload: GetTodoDto) {
    return this.todoService.findAll(queryPayload);
  }

  @ApiOperation({
    summary: 'Get todo',
    description: 'Get a todo by id',
  })
  @ApiOkTemplateResponse({ model: Todo, description: 'Response todo data' })
  @ApiDefaultErrorsTemplateResponse({
    disableDuplicateUser: true,
    disableForbidden: true,
    disableTooManyRequests: true,
    disableUnauthorized: true,
    disableUnprocessable: true,
  })
  @Get(':id')
  findOne(@Param() params: OnlyIDParamDto) {
    return this.todoService.getById(params.id);
  }

  @ApiOperation({
    summary: 'Update todo',
    description: 'Update todo data by id',
  })
  @ApiOkTemplateResponse({
    model: Todo,
    description: 'Response updated todo data',
  })
  @ApiDefaultErrorsTemplateResponse({
    disableDuplicateUser: true,
    disableForbidden: true,
    disableTooManyRequests: true,
    disableUnauthorized: true,
    disableUnprocessable: true,
  })
  @Patch(':id')
  update(
    @Param() params: OnlyIDParamDto,
    @Body() updateTodoDto: UpdateTodoDto,
  ) {
    return this.todoService.update(params.id, updateTodoDto);
  }

  @ApiOperation({
    summary: 'Delete todo',
    description: 'Delete todo by id',
  })
  @ApiOkTemplateResponse({
    description: 'Delete succeed and response empty data',
  })
  @ApiDefaultErrorsTemplateResponse({
    disableDuplicateUser: true,
    disableForbidden: true,
    disableTooManyRequests: true,
    disableUnauthorized: true,
    disableUnprocessable: true,
  })
  @Delete(':id')
  delete(@Param() params: OnlyIDParamDto) {
    return this.todoService.delete(params.id);
  }

  @ApiOperation({
    summary: 'Get todo list with join tables',
    description: 'Filter todo list with join tables',
  })
  @ApiPaginatedTemplateResponse({ model: Todo })
  @Get('tables/with-joins')
  getTodoListWithJoinTables(@Query() queryPayload: GetTodoWithJoinTable) {
    return this.todoService.getTodoListWithJoinTables(queryPayload);
  }
}
