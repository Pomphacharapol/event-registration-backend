import { execSync } from 'child_process';
import { getOsPlatForm } from '../util';

const os = getOsPlatForm();

if (os === 'linux') {
  execSync(`sudo yarn run tsc && sudo yarn run copy:assets`);
} else {
  execSync('tsc && yarn run copy:assets');
}
