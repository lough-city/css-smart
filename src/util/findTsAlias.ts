import * as fs from 'fs';
import { TS_ALIAS_REG } from '../constants/regex';
import { execObjectByString } from './regex';

/**
 * 查找文件里的别名
 */
const findTsAlias = (path: string) => {
  if (fs.existsSync(path)) {
    const content = fs.readFileSync(path, 'utf-8');

    return execObjectByString(TS_ALIAS_REG, content);
  }

  return {};
};

export default findTsAlias;
