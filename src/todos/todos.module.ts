import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppLoggerModule } from '../common/app-logger/app-logger.module';
import { AutoIdModule } from '../common/providers/auto-id/auto-id.module';
import { Todo } from './entities/todo.entity';
import { TodoController } from './todos.controller';
import { TodoRepository } from './todos.repository';
import { TodoService } from './todos.service';

@Module({})
export class TodosModule {
  static forRoot(enable: boolean): DynamicModule {
    if (enable) {
      return {
        module: TodosModule,
        imports: [
          AppLoggerModule,
          AutoIdModule,
          TypeOrmModule.forFeature([Todo]),
        ],
        providers: [TodoRepository, TodoService],
        controllers: [TodoController],
      };
    }

    return {
      module: TodosModule,
    };
  }
}
