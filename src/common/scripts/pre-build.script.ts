import { execSync } from 'child_process';
import * as fs from 'fs';
import { getOsPlatForm } from '../util';

const os = getOsPlatForm();
const distPath = 'dist';

if (fs.existsSync(distPath)) {
  if (os === 'linux') {
    execSync(`sudo yarn run rimraf dist`);
  } else {
    execSync(`yarn run rimraf dist`);
  }
}
