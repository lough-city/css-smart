import path, { join, resolve } from 'path';
import { globalAliasPathConfig } from '../util/config';
import { getWorkspaceRootPath } from '../util/path';
import findTsAlias from '../util/findTsAlias';
import { existsSync, readFileSync } from 'fs';
import { PATH_BASE_URL_REG } from '../constants/regex';

class TsAliasBase {
  private options: { paths?: Array<string> } = {};

  init(parameters: { paths: Array<string> }) {
    this.options = parameters;
  }

  getAll() {
    if (!this.options.paths?.length) return {};

    return Object.assign({}, ...this.options.paths.map(path => findTsAlias(join(getWorkspaceRootPath(), path))));
  }

  private getBaseUrl() {
    const path = this.options.paths?.[0];
    const content = path && existsSync(path) ? readFileSync(path, 'utf-8') : '';
    return PATH_BASE_URL_REG.exec(content)?.[1] || '';
  }

  getLocationPath(params: { fileName: string; word: string }) {
    const { word, fileName } = params;
    const aliasDict = this.getAll();
    const baseUrl = this.getBaseUrl();

    let importPath = word.replaceAll(`'`, '').replaceAll(`“`, '');

    let locationPath = '';
    const key = Object.keys(aliasDict).find(alias => importPath.includes(alias));
    if (key) {
      importPath = importPath.replace(key, aliasDict[key]);

      if (baseUrl) {
        locationPath = path.resolve(getWorkspaceRootPath(), baseUrl, importPath);
      } else {
        locationPath = path.resolve(getWorkspaceRootPath(), importPath);
      }
    } else {
      locationPath = path.resolve(path.dirname(fileName), importPath);
    }

    return locationPath;
  }
}

const tsAliasBase = new TsAliasBase();

tsAliasBase.init({
  paths: [
    globalAliasPathConfig.get()
      ? getWorkspaceRootPath() + globalAliasPathConfig.get()
      : resolve(getWorkspaceRootPath(), 'tsconfig.json')
  ]
});

export default tsAliasBase;
