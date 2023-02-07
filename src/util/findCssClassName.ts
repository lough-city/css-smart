import * as fs from 'fs';
import { CLASS_NAME_REG } from '../constants/regex';
import { execObjectByString } from './regex';

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
