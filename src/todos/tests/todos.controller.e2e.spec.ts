import { createMock } from '@golevelup/ts-jest';
import { INestApplication } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { AppModule } from '../../app.module';
import { AppLoggerService } from '../../common/app-logger';
import { PaginationResponseDto } from '../../common/decorators/typeorm-paginate';
import { ErrorBadRequestDto, ResponseTemplateDto } from '../../common/dto';
import { BadRequestExceptionFilter } from '../../common/filters/customException/badRequest.exception';
import { HttpExceptionFilter } from '../../common/filters/customException/custom.exception';
import { PathNotFoundExceptionFilter } from '../../common/filters/customException/pathNotFound.exception';
import { UnknownExceptionFilter } from '../../common/filters/customException/unknown.exception';
import { TemplateResponseTransformerInterceptor } from '../../common/interceptors/template-response';
import validation from '../../common/pipes/validation';
import { CreateTodoDto } from '../dto/create-todo.dto';
import { Todo } from '../entities/todo.entity';

describe('TodoController', () => {
  let app: INestApplication;
  let httpServer: any;

  beforeAll(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = testingModule.createNestApplication();
    app.useGlobalFilters(
      new UnknownExceptionFilter(createMock<AppLoggerService>(), true),
    );
    app.useGlobalFilters(
      new HttpExceptionFilter(createMock<AppLoggerService>(), true, true),
    );
    app.useGlobalFilters(new PathNotFoundExceptionFilter(true));
    app.useGlobalFilters(
      new BadRequestExceptionFilter(createMock<AppLoggerService>(), true),
    );

    app.useGlobalInterceptors(
      new TemplateResponseTransformerInterceptor(new Reflector()),
    );

    app.useGlobalPipes(validation);

    httpServer = app.getHttpServer();

    await app.init();
  });

  afterAll(async () => {
    const todoRepo = app.get<Repository<Todo>>(getRepositoryToken(Todo));
    await todoRepo.clear();
  });

  describe('/GET todo', () => {
    it('should return empty result when no todo data', async () => {
      jest.setTimeout(10000);
      const expectResult = <ResponseTemplateDto<PaginationResponseDto<Todo>>>{
        status: {
          code: 'S0200',
          message: 'Success',
        },
        data: {
          items: [],
          meta: {
            totalItems: 0,
            itemCount: 0,
            itemsPerPage: 20,
            totalPages: 0,
            currentPage: 1,
          },
        },
      };

      const response = await request(httpServer).get('/todos');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expectResult);
    });

    it('should return todo result when there is todo data', async () => {
      const createResponse = await request(httpServer).post('/todos').send({
        name: 'a',
        description: 'b',
        creatorName: 'c',
      });

      expect(createResponse.status).toBe(201);

      const expectResult = <ResponseTemplateDto<PaginationResponseDto<Todo>>>{
        status: {
          code: 'S0200',
          message: 'Success',
        },
        data: {
          items: [
            {
              id: expect.any(String),
              createdAt: expect.any(String),
              creatorName: 'c',
              description: 'b',
              statusActive: false,
              name: 'a',
              encryptedName: 'a',
              updatedAt: expect.any(String),
            },
          ],
          meta: {
            totalItems: 1,
            itemCount: 1,
            itemsPerPage: 20,
            totalPages: 1,
            currentPage: 1,
          },
        },
      };

      const response = await request(httpServer).get('/todos');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expectResult);
    });

    it('should return created todo data', async () => {
      const expectResult = <ResponseTemplateDto<Todo>>{
        status: {
          code: 'S0201',
          message: 'Created',
        },
        data: {
          id: expect.any(String),
          name: 'a',
          encryptedName: 'a',
          description: 'b',
          creatorName: 'c',
          statusActive: false,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      };

      const createTodo: CreateTodoDto = {
        name: 'a',
        description: 'b',
        creatorName: 'c',
      };

      const response = await request(httpServer)
        .post('/todos')
        .send(createTodo);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(expectResult);
    });

    it('should return error 400 for invalid input', async () => {
      const expectError = <ResponseTemplateDto<ErrorBadRequestDto>>{
        status: <ErrorBadRequestDto>{
          code: 'E0400',
          message: 'Bad Request',
          meta: {
            validationErrors: [
              {
                fieldName: 'creatorName',
                constraints: {
                  isNotEmpty: 'creatorName should not be empty',
                  isString: 'creatorName must be a string',
                },
              },
            ],
          },
        },
      };

      const createTodo2 = {
        name: 'a',
        description: 'b',
      };

      const response = await request(httpServer)
        .post('/todos')
        .send(createTodo2);

      expect(response.status).toBe(400);
      expect(response.body).toEqual(expectError);
    });
  });
});
