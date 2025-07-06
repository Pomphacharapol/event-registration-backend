import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTodoTable1664556019111 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'todo',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            isPrimary: true,
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'encrypted_name',
            type: 'text',
          },
          {
            name: 'description',
            type: 'varchar',
          },
          {
            name: 'creator_name',
            type: 'varchar',
          },
          {
            name: 'status_active',
            type: 'boolean',
          },
          {
            name: 'created_at',
            type: 'timestamp',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('todo');
  }
}
