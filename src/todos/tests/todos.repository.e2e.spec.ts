import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';
import { AppModule } from '../../app.module';
import { Todo } from '../entities/todo.entity';
import { TodoRepository } from '../todos.repository';

describe('TodoRepository', () => {
  let app: INestApplication;
  let todoRepo: TodoRepository;
  let todoRepoToken: Repository<Todo>;

  beforeAll(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = testingModule.createNestApplication();

    todoRepoToken = app.get<Repository<Todo>>(getRepositoryToken(Todo));
    await todoRepoToken.clear();

    todoRepo = app.get<TodoRepository>(TodoRepository);
  });

  afterEach(async () => {
    await todoRepoToken.clear();
  });

  describe('repository todo', () => {
    describe('get with not found', () => {
      it('should return null', async () => {
        const resultNotFound = await todoRepo.getById('id_test_x');
        expect(resultNotFound).toBeNull();
      });
    });

    describe('find with empty data', () => {
      it('should return empty pagination result', async () => {
        const expectResultEmpty = <Pagination<Todo>>{
          items: [],
          meta: {
            currentPage: 1,
            itemCount: 0,
            itemsPerPage: 5,
            totalItems: 0,
            totalPages: 0,
          },
        };
        const resultEmpty = await todoRepo.findAll(false, <IPaginationOptions>{
          limit: 5,
          page: 1,
        });
        expect(resultEmpty).toEqual(expectResultEmpty);
      });
    });

    describe('create and find todo', () => {
      it('should success', async () => {
        const now = new Date();
        const createTodo = <Todo>{
          id: 'id_test_x',
          name: 'test_name_1',
          encryptedName: 'test_name_1',
          description: 'test_desc_1',
          creatorName: 'test_creator_1',
          statusActive: false,
          createdAt: now,
          updatedAt: now,
        };

        const resultCreateTodo = await todoRepo.create(createTodo);
        expect(resultCreateTodo).toEqual(createTodo);

        const resultFound = await todoRepo.getById('id_test_x');
        expect(resultFound).toEqual(createTodo);

        const expectResultPagination = <Pagination<Todo>>{
          items: [createTodo],
          meta: {
            currentPage: 1,
            itemCount: 1,
            itemsPerPage: 5,
            totalItems: 1,
            totalPages: 1,
          },
        };
        const resultPagination = await todoRepo.findAll(false, <
          IPaginationOptions
        >{
          limit: 5,
          page: 1,
        });
        expect(resultPagination).toEqual(expectResultPagination);
      });
    });

    describe('delete todo', () => {
      it('should return not found when get deleted todo', async () => {
        const now = new Date();
        const createTodo = <Todo>{
          id: 'id_test_delete',
          name: 'test_name_1',
          encryptedName: 'test_name_1',
          description: 'test_desc_1',
          creatorName: 'test_creator_1',
          statusActive: false,
          createdAt: now,
          updatedAt: now,
        };

        const resultCreateTodo = await todoRepo.create(createTodo);
        expect(resultCreateTodo).toEqual(createTodo);

        let resultTodo = await todoRepo.getById('id_test_delete');
        expect(resultTodo).toEqual(createTodo);

        const isDeleted = await todoRepo.delete('id_test_delete');
        expect(isDeleted).toBeTruthy();

        resultTodo = await todoRepo.getById('id_test_delete');
        expect(resultTodo).toBeNull();
      });
    });
  });
});
