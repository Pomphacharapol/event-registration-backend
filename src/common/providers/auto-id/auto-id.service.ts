import { Injectable } from '@nestjs/common';
import { customAlphabet } from 'nanoid';

// Nano ID Collision Calculator
// https://zelark.github.io/nano-id-cc/

@Injectable()
export class AutoIdService {
  readonly #default_alpha_num =
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

  readonly #default_length = 15;

  gen(length: number = this.#default_length): string {
    const nanoid = customAlphabet(this.#default_alpha_num, length);

    return nanoid();
  }
}
