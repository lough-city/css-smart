import { exec } from 'child_process';
import { readFileSync } from 'fs';
import { join } from 'path';
import { getWorkspaceRootPath } from './path';

function execute(command: string) {
  return new Promise((resolve, reject) => {
    exec(command, function (err, stdout, stderr) {
      if (err != null) {
        resolve(err);
      } else {
        resolve(stdout);
      }
    });
  });
}

let git: any = {};
let pack: any = {};

export const initInfo = async () => {
  try {
    const name = (await execute('git config user.name')) as string;
    const email = (await execute('git config user.email')) as string;

    git = { name, email };
  } catch (error) {}

  const path = join(getWorkspaceRootPath(), 'package.json');

  const str = readFileSync(path, { encoding: 'utf-8' });

  try {
    pack = JSON.parse(str);
  } catch (error) {}
};

export const getGitInfo = () => {
  return git;
};

export const getPackageInfo = () => {
  return pack;
};
