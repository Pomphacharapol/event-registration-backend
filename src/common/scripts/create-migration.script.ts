import { exec } from 'child_process';
import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const createMigration = () => {
  rl.question('Enter the name of your migration: ', (name) => {
    if (!name) {
      console.error('Migration name is required!');
      rl.close();
      process.exit(1);
    }

    const command = `cross-env NODE_ENV=local yarn run typeorm migration:create ./src/migrations/${name}`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${stderr}`);
      } else {
        console.log(stdout);
      }
      rl.close();
    });
  });
};

createMigration();
