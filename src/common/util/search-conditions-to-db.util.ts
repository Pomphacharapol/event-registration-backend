import { Brackets, WhereExpressionBuilder } from 'typeorm';
import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata';

const addInnerSearchConditions = (
  innerQb: any,
  alias: string,
  columns: ColumnMetadata[],
  searchKeyword: string,
  selectColumns: string[] = [],
) => {
  const validColumns =
    selectColumns.length > 0
      ? columns.filter(
          (col) =>
            selectColumns.includes(col.propertyName) && col.type === String,
        )
      : columns.filter((col) => col.type === String);

  let isFirstCondition = true;
  for (const col of validColumns) {
    const condition = `${alias}.${col.propertyName} LIKE :keyword`;
    if (isFirstCondition) {
      innerQb.where(condition, { keyword: `%${searchKeyword}%` });
      isFirstCondition = false;
    } else {
      innerQb.orWhere(condition, { keyword: `%${searchKeyword}%` });
    }
  }

  return innerQb;
};

export const addSearchConditions = (
  outerQb: WhereExpressionBuilder,
  alias: string,
  columns: ColumnMetadata[],
  searchKeyword: string,
  selectColumns?: string[],
) => {
  return outerQb.orWhere(
    new Brackets((innerQb) => {
      addInnerSearchConditions(
        innerQb,
        alias,
        columns,
        searchKeyword,
        selectColumns,
      );
    }),
  );
};
