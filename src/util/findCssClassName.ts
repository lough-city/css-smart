import * as fs from 'fs';
import { CLASS_NAME_REG } from '../constants/regex';

const execObjectByString = (REG: RegExp, str: string) => {
  const obj: Record<string, string> = {};

  let matched: any;
  while ((matched = REG.exec(str)) !== null) {
    // obj[matched[1]] = matched[2];
    const classNames = matched[1].split(',');
    classNames.forEach((className: any) => {
      if (className?.includes(':')) return;

      obj[className.replace(/^\./, '')] = matched[2];
    });
  }

  return obj;
};

/**
 * 查找文件里的css类名
 */
const findCssClassName = (path: string) => {
  if (fs.existsSync(path)) {
    const content = fs.readFileSync(path, 'utf-8');

    return execObjectByString(CLASS_NAME_REG, content);
  }

  return {};
};

export default findCssClassName;
