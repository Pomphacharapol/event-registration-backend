import { ValueTransformer } from 'typeorm';

type DateStringOrUndefined = Date | string | undefined;

export class DefaultCreateDateTransformer implements ValueTransformer {
  public from(value?: DateStringOrUndefined): DateStringOrUndefined {
    return value;
  }

  public to(value?: DateStringOrUndefined): DateStringOrUndefined {
    if (!value) {
      return new Date();
    }

    return value;
  }
}

export class DefaultUpdateDateTransformer implements ValueTransformer {
  public from(value?: DateStringOrUndefined): DateStringOrUndefined {
    return value;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public to(value?: DateStringOrUndefined): DateStringOrUndefined {
    return new Date();
  }
}
