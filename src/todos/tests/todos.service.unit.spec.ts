import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import {
  IPaginationMeta,
  IPaginationOptions,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { AppLoggerService } from '../../common/app-logger/app-logger.service';
import { NotFoundErrorException } from '../../common/dto';
import { AutoIdService } from '../../common/providers/auto-id/auto-id.service';
import { GetTodoDto } from '../dto';
import { CreateTodoDto } from '../dto/create-todo.dto';
import { UpdateTodoDto } from '../dto/update-todo.dto';
import { Todo } from '../entities/todo.entity';
import { TodoRepository } from '../todos.repository';
import { TodoService } from '../todos.service';

describe('TodoService', () => {
  let service: TodoService;
  const todoRepositoryMock = createMock<TodoRepository>();
  const autoIdServiceMock = createMock<AutoIdService>();
  const appLoggerServiceMock = createMock<AppLoggerService>();

  const todoId = 'todo_1';

  beforeAll(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        { provide: TodoRepository, useValue: todoRepositoryMock },
        { provide: AutoIdService, useValue: autoIdServiceMock },
        { provide: AppLoggerService, useValue: appLoggerServiceMock },
      ],
    }).compile();

    service = testingModule.get<TodoService>(TodoService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Find todo', () => {
    describe('with active status', () => {
      it('it should return todo and pagination', async () => {
        const getTodoParams: GetTodoDto = {
          statusActive: true,
          limit: 5,
          page: 1,
        };

        const getTodoPagination: IPaginationOptions = {
          limit: 5,
          page: 1,
        };

        const todo: Pagination<Todo, IPaginationMeta> = {
          items: [
            {
              id: 'todo_1',
              name: 'test_title',
              description: 'test_description',
              creatorName: 'test_creator',
              statusActive: true,
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
            },
          ],
          meta: {
            itemCount: 1,
            totalItems: 1,
            itemsPerPage: 5,
            totalPages: 1,
            currentPage: 1,
          },
        };

        todoRepositoryMock.findAll.mockResolvedValueOnce(todo);

        const resultTodo = await service.findAll(getTodoParams);

        expect(todoRepositoryMock.findAll).toBeCalledWith(
          true,
          getTodoPagination,
        );
        expect(resultTodo).toEqual(todo);
      });
    });
  });

  describe('Get todo', () => {
    describe('and repository response null (not found case)', () => {
      it('should throw a not found error', async () => {
        todoRepositoryMock.getById.mockResolvedValueOnce(null);

        try {
          await service.getById(todoId);
        } catch (error) {
          expect(error).toBeInstanceOf(NotFoundErrorException);
          expect(error).toHaveProperty('message', "not found todo: 'todo_1'");
        }

        expect(todoRepositoryMock.getById).toBeCalledWith(todoId);
      });
    });

    describe('and repository response todo data', () => {
      it('should return todo', async () => {
        const expectedTodo: Todo = {
          id: todoId,
          name: 'test_title',
          description: 'test_description',
          creatorName: 'test_creator',
          statusActive: false,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        };

        todoRepositoryMock.getById.mockResolvedValueOnce(expectedTodo);

        const resultTodo = await service.getById(todoId);

        expect(todoRepositoryMock.getById).toBeCalledWith(todoId);
        expect(resultTodo).toEqual(expectedTodo);
      });
    });
  });

  describe('Create todo', () => {
    describe('with valid input', () => {
      it('should create and return todo', async () => {
        const input: CreateTodoDto = {
          name: 'test_title',
          description: 'test_description',
          creatorName: 'test_creator',
        };
        const expectedTodo: Todo = {
          id: todoId,
          name: 'test_title',
          description: 'test_description',
          creatorName: 'test_creator',
          statusActive: false,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        };

        todoRepositoryMock.create.mockResolvedValueOnce(expectedTodo);

        const resultTodo = await service.create(input);

        expect(resultTodo).toEqual(expectedTodo);
      });
    });
  });

  describe('Update todo', () => {
    describe('but not found todo', () => {
      it('should throw error exception', async () => {
        todoRepositoryMock.getById.mockResolvedValueOnce(null);

        try {
          await service.update(todoId, <UpdateTodoDto>{
            statusActive: true,
          });
        } catch (error) {
          expect(error).toBeInstanceOf(NotFoundErrorException);
          expect(error).toHaveProperty('message', "not found todo: 'todo_1'");
        }
      });
    });

    describe('found todo', () => {
      it('should update and return todo', async () => {
        const input: UpdateTodoDto = {
          statusActive: true,
        };

        const todo: Todo = {
          id: todoId,
          name: 'test_title',
          description: 'test_description',
          creatorName: 'test_creator',
          statusActive: true,
        };

        const repoInput = <Todo>{
          statusActive: true,
        };

        const expectedTodo: Todo = {
          ...todo,
          statusActive: true,
        };

        todoRepositoryMock.update.mockResolvedValueOnce(true);
        todoRepositoryMock.getById.mockResolvedValueOnce(todo);

        const resultTodo = await service.update(todoId, input);

        expect(todoRepositoryMock.update).toBeCalledWith(todoId, repoInput);
        expect(resultTodo).toEqual(expectedTodo);
      });
    });

    describe('found todo but update not success', () => {
      it('should throw an internal error', async () => {
        const input: UpdateTodoDto = {
          statusActive: true,
        };
        const todo: Todo = {
          id: todoId,
          name: 'test_title',
          description: 'test_description',
          creatorName: 'test_creator',
          statusActive: true,
        };
        const repoInput = <Todo>{
          statusActive: true,
        };

        todoRepositoryMock.getById.mockResolvedValueOnce(todo);
        todoRepositoryMock.update.mockResolvedValueOnce(false);

        try {
          await service.update(todoId, input);
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          expect(todoRepositoryMock.update).toBeCalledWith(todoId, repoInput);
        }
      });
    });
  });

  describe('Delete todo', () => {
    describe('found todo', () => {
      it('it should delete and return true', async () => {
        const todo: Todo = {
          id: 'todo_1',
          name: 'test_title',
          description: 'test_description',
          creatorName: 'test_creator',
          statusActive: true,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        };

        const deleteResult = true;

        todoRepositoryMock.getById.mockResolvedValueOnce(todo);
        todoRepositoryMock.delete.mockResolvedValueOnce(deleteResult);

        const resultTodo = await service.delete(todo.id);

        expect(todoRepositoryMock.delete).toBeCalledWith(todo.id);
        expect(todoRepositoryMock.getById).toBeCalledWith(todo.id);
        expect(resultTodo).toEqual(todo);
      });
    });

    describe('found todo but update not success', () => {
      it('it should throw an error exception', async () => {
        const todo: Todo = {
          id: 'todo_1',
          name: 'test_title',
          description: 'test_description',
          creatorName: 'test_creator',
          statusActive: true,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        };

        const deleteResult = false;

        todoRepositoryMock.getById.mockResolvedValueOnce(todo);
        todoRepositoryMock.delete.mockResolvedValueOnce(deleteResult);

        try {
          await service.delete(todo.id);
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          expect(todoRepositoryMock.delete).toBeCalledWith(todo.id);
          expect(todoRepositoryMock.getById).toBeCalledWith(todo.id);
        }
      });
    });

    describe('not found todo', () => {
      it('it throw error not found', async () => {
        const todoId = 'todo_1';
        todoRepositoryMock.getById.mockResolvedValueOnce(null);

        try {
          await service.delete(todoId);
        } catch (error) {
          expect(error).toBeInstanceOf(NotFoundErrorException);
          expect(error).toHaveProperty(
            'message',
            "not found todo with id: 'todo_1'",
          );
        }

        expect(todoRepositoryMock.getById).toBeCalledWith(todoId);
      });
    });
  });
});
