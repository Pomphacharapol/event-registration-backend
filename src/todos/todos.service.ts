import { Injectable } from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { AppLoggerService } from '../common/app-logger/app-logger.service';
import { CustomHttpCodeConstant } from '../common/constant';
import {
  InternalErrorException,
  NotFoundErrorException,
} from '../common/dto/custom-error-type.dto';
import { AutoIdService } from '../common/providers/auto-id/auto-id.service';
import {
  CreateTodoDto,
  GetTodoDto,
  GetTodoWithJoinTable,
  UpdateTodoDto,
} from './dto';
import { Todo } from './entities/todo.entity';
import { TodoRepository } from './todos.repository';

@Injectable()
export class TodoService {
  constructor(
    private readonly todoRepository: TodoRepository,
    private readonly autoId: AutoIdService,
    private readonly logger: AppLoggerService,
  ) {
    this.logger.setContext('TodoService');
  }

  create(createTodoDto: CreateTodoDto): Promise<Todo> {
    const todo = <Todo>{
      ...createTodoDto,
      id: this.autoId.gen(),
      statusActive: false,
      encryptedName: createTodoDto.name,
    };

    return this.todoRepository.create(todo);
  }

  findAll(queryPayload: GetTodoDto): Promise<Pagination<Todo>> {
    return this.todoRepository.findAll(queryPayload.statusActive, {
      limit: queryPayload.limit,
      page: queryPayload.page,
    });
  }

  async getById(id: string): Promise<Todo> {
    const todo = await this.todoRepository.getById(id);
    if (!todo) {
      throw new NotFoundErrorException({
        code: CustomHttpCodeConstant.NOTFOUND,
        message: `not found todo: '${id}'`,
      });
    }

    return todo;
  }

  async update(id: string, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    const updateTodo = <Todo>{
      ...updateTodoDto,
    };

    const isUpdated = await this.todoRepository.update(id, updateTodo);
    if (!isUpdated) {
      throw new NotFoundErrorException();
    }

    return this.todoRepository.getById(id);
  }

  async delete(id: string): Promise<Todo> {
    const todo = await this.todoRepository.getById(id);
    if (!todo) {
      throw new NotFoundErrorException({
        code: CustomHttpCodeConstant.NOTFOUND,
        message: `not found todo with id: '${id}'`,
      });
    }

    const isDeleted = await this.todoRepository.delete(id);
    if (!isDeleted) {
      throw new InternalErrorException({
        code: `${CustomHttpCodeConstant.UNABLE_DELETE}Todo`,
        message: `unable delete todo with id: '${id}'`,
      });
    }

    return todo;
  }

  getTodoListWithJoinTables(
    queryPayload: GetTodoWithJoinTable,
  ): Promise<Pagination<Todo>> {
    return this.todoRepository.getTodoListWithJoinTables(queryPayload, {
      limit: queryPayload.limit,
      page: queryPayload.page,
    });
  }
}
