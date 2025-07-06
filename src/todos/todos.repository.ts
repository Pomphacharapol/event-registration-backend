import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { Brackets, DataSource, Repository } from 'typeorm';
import { AppLoggerService } from '../common/app-logger/app-logger.service';
import { addSearchConditions } from '../common/util';
import { GetTodoWithJoinTable } from './dto';
import { Todo } from './entities/todo.entity';

@Injectable()
export class TodoRepository {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepo: Repository<Todo>,

    private readonly dataSource: DataSource,
    private readonly logger: AppLoggerService,
  ) {
    this.logger.setContext('TodoRepository');
  }

  async create(input: Todo): Promise<Todo> {
    return await this.todoRepo.save(input);
  }

  async findAll(
    statusActive: boolean,
    options: IPaginationOptions,
  ): Promise<Pagination<Todo>> {
    const query = this.todoRepo.createQueryBuilder('c');
    if (statusActive !== undefined) {
      query.where('c.status_active = :statusActive', { statusActive });
    }

    const resultTodo = paginate<Todo>(query, options);

    return resultTodo;
  }

  async getById(id: string): Promise<Todo> | null {
    return this.todoRepo.findOneBy({ id });
  }

  async update(id: string, todo: Todo): Promise<boolean> {
    const updatedResult = await this.todoRepo.update(id, todo);
    if (updatedResult.affected && updatedResult.affected == 1) {
      return true;
    }

    return false;
  }

  async delete(id: string): Promise<boolean> {
    const deletedResult = await this.todoRepo.delete(id);
    if (deletedResult.affected && deletedResult.affected == 1) {
      return true;
    }

    return false;
  }

  async getTodoListWithJoinTables(
    payload: GetTodoWithJoinTable,
    options: IPaginationOptions & { page: number; limit: number },
  ): Promise<Pagination<Todo>> {
    this.logger.info(
      'getTodoListWithJoinTables --> Database: ',
      JSON.stringify({ payload, options }),
    );

    const query = this.todoRepo.createQueryBuilder('c');

    /**
      * @example: join table conditions
      *  
      if (payload?.isShowDataWithJoinTable1 === 'true') {
        query.leftJoinAndSelect('c.JoinTable1', 't1');
      }
      if (payload?.isShowDataWithJoinTable1 === 'true') {
        query.leftJoinAndSelect('c.JoinTable1', 't2');
      }
    */

    if (payload?.statusActive !== undefined) {
      query.where('c.status_active = :statusActive', {
        statusActive: payload.statusActive,
      });
    }

    if (payload?.searchKeyword !== undefined) {
      const keyword = `%${payload.searchKeyword.trim()}%`;
      if (keyword !== undefined) {
        const searchKeyword = `%${keyword.trim()}%`;
        const entitiesToSearch = [
          {
            alias: 'c',
            metadata: this.dataSource.getMetadata(Todo).columns,
            selectColumns: [],
          },
          // {
          //   alias: 't1',
          //   metadata: this.dataSource.getMetadata(JoinTable1Entity).columns,
          //   selectColumns: [],
          // },
          // {
          //   alias: 't2',
          //   metadata: this.dataSource.getMetadata(JoinTable2Entity).columns,
          //   selectColumns: [],
          // },
        ];

        /**
          * @example: search conditions
          * 
          if (!payload?.isShowDataWithJoinTable1) {
            entitiesToSearch = entitiesToSearch.filter((_, index) => index !== 1);
          }
          if (!payload?.isShowDataWithJoinTable2) {
            entitiesToSearch = entitiesToSearch.filter((_, index) => index !== 2);
          }
        */

        query.andWhere(
          new Brackets((outerQb) => {
            for (const {
              alias,
              metadata,
              selectColumns = [],
            } of entitiesToSearch) {
              addSearchConditions(
                outerQb,
                alias,
                metadata,
                searchKeyword,
                selectColumns,
              );
            }
          }),
        );
      }
    }
    query.skip((options.page - 1) * options.limit).take(options.limit);

    const [items, totalItems] = await query.getManyAndCount();
    const result: Pagination<Todo> = {
      items,
      meta: {
        itemCount: items.length,
        totalItems,
        itemsPerPage: options.limit,
        totalPages: Math.ceil(totalItems / options.limit),
        currentPage: options.page,
      },
    };

    this.logger.info(
      'Database --> getTodoListWithJoinTables: ',
      JSON.stringify(result),
    );

    return result;
  }
}
