/* eslint-disable @typescript-eslint/no-unused-vars */

import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'JoinTableValidator', async: false })
export class JoinTableValidator implements ValidatorConstraintInterface {
  validate(_value: any, args: ValidationArguments): boolean {
    const object = args.object as any;

    if (
      object?.isShowDataWithJoinTable1 === undefined ||
      object?.isShowDataWithJoinTable1 === false ||
      object?.isShowDataWithJoinTable1 === 'false'
    ) {
      return false;
    }

    return true;
  }

  defaultMessage(_args: ValidationArguments): string {
    return 'isShowDataWithJoinTable2 must have a value before setting isShowDataWithJoinTable1.';
  }
}
