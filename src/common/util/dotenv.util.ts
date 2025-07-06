import * as dotenv from 'dotenv';
import * as path from 'path';

export function injectableDotEnvironment(nodeEnvironment: string) {
  const dotenv_path = path.resolve(
    process.cwd(),
    `./environment/service/.env.${nodeEnvironment}`,
  );

  const result = dotenv.config({ path: dotenv_path });
  if (result.error) {
    console.error(result.error);
  }
}
