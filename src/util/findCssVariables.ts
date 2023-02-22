import * as fs from 'fs';
import { CSS_VARIABLES_REG, STYLUS_VARIABLES_REG } from '../constants/regex';
import { execObjectByString } from './regex';

/**
 * 查找文件里的css变量
 */
const findCssVariables = (path: string, type = 'css') => {
  if (fs.existsSync(path)) {
    const content = fs.readFileSync(path, 'utf-8');

    return execObjectByString(type === 'styl' ? STYLUS_VARIABLES_REG : CSS_VARIABLES_REG, content);
  }

  return {};
};

export default findCssVariables;
