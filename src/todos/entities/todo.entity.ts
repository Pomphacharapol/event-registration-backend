import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiPropertyExampleConstant } from '../../common/constant';
import {
  DefaultCreateDateTransformer,
  DefaultUpdateDateTransformer,
} from '../../common/database/default-date-transformer';
import { decryptFromAES, encryptToAes } from '../../common/util';

@Entity({ name: 'todo' })
export class Todo {
  @ApiProperty({
    description: 'unique id',
    example: ApiPropertyExampleConstant.NANO_ID,
    type: 'string',
  })
  @PrimaryColumn()
  id: string;

  @ApiProperty({ description: 'todo title', example: 'Read a book' })
  @Column()
  name: string;

  @ApiPropertyOptional({ description: 'encrypted todo title', example: '' })
  @Column({
    name: 'encrypted_name',
    transformer: {
      to: (value) => JSON.stringify(encryptToAes(value)),
      from: (value) => {
        const parsedValue = JSON.parse(value);

        return decryptFromAES(
          parsedValue.encryptedData,
          parsedValue.encryptedKey,
          parsedValue.iv,
        );
      },
    },
  })
  encryptedName?: string;

  @ApiProperty({ description: 'todo description', example: 'Read some pages' })
  @Column()
  description: string;

  @ApiProperty({ description: 'Creator name', example: 'Bo' })
  @Column({ name: 'creator_name' })
  creatorName: string;

  @ApiProperty({ description: 'todo status' })
  @Column({ name: 'status_active' })
  statusActive: boolean;

  @ApiPropertyOptional({ description: 'The time that create todo' })
  @CreateDateColumn({
    name: 'created_at',
    transformer: new DefaultCreateDateTransformer(),
  })
  createdAt?: Date;

  @ApiPropertyOptional({ description: 'The latest time that update todo' })
  @UpdateDateColumn({
    name: 'updated_at',
    transformer: new DefaultUpdateDateTransformer(),
  })
  updatedAt?: Date;
}
