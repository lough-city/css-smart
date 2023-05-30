import { defineConfig } from '@css-smart/config';
import { existsSync } from 'fs';
import { join } from 'path';
import { globalLanguagePackageConfig } from '../util/config';
import { getGitInfo, getPackageInfo } from '../util/info';
import { getWorkspaceRootPath } from '../util/path';
import { ClassName } from './className';
import { Colorfully } from './colorfully';
import { Variables } from './variables';

class LanguagePackage {
  private _config: ReturnType<typeof defineConfig> = {};

  private get config() {
    return this._config;
  }

  base!: {
    className: ClassName;
    variables: Variables;
    colorfully: Colorfully;
  };

  private options: { paths?: Array<string> } = {};

  init(parameters: { paths: Array<string> }) {
    this.options = parameters;

    this.base = {
      className: new ClassName(),
      variables: new Variables(),
      colorfully: new Colorfully()
    };

    return this;
  }

  loadData() {
    const path = this.options.paths?.[0] || '';

    if (path) {
      const isDir = existsSync(join(getWorkspaceRootPath(), path));
      const realPath = isDir
        ? join(getWorkspaceRootPath(), path)
        : join(getWorkspaceRootPath(), 'node_modules', path, 'css.smart.config.js');

      try {
        return import(realPath).then(m => {
          const config = (m.default || {}) as ReturnType<typeof defineConfig>;

          config.variablePath = this.handlePath(config.variablePath);
          config.classNamePath = this.handlePath(config.classNamePath);

          this.base.className.init({ paths: config.classNamePath });
          this.base.variables.init({ paths: config.variablePath });
          this.base.colorfully.init({ paths: config.themePackage || [] });

          this._config = config;
        });
      } catch (error) {}
    }
  }

  private handlePath(pathList: Array<string> = []) {
    const isDir = existsSync(join(getWorkspaceRootPath(), this.options.paths?.[0] || ''));
    return pathList.map(path => {
      return isDir ? path : join('node_modules', this.options.paths?.[0] || '', path);
    });
  }

  private idMap = {
    VariableCompletion: 0,
    VariableCodelens: 0,
    ClassNameCompletion: 0,
    FileSkip: 0
  };

  statMount() {
    this.config?.lifeCycle?.mount?.({
      git: getGitInfo(),
      pack: getPackageInfo()
    });
  }

  statFunc(params: {
    name: 'VariableCompletion' | 'VariableCodelens' | 'ClassNameCompletion' | 'FileSkip';
    targetValue: string;
  }) {
    const branchId = new Date().getTime() + '_' + this.idMap[params.name];

    this.config.lifeCycle?.func?.({
      branchId,
      event: 'show',
      pack: getPackageInfo(),
      git: getGitInfo(),
      ...params
    });

    return (useParams: { value: string; targetValue: string }) => {
      this.config.lifeCycle?.func?.({
        name: params.name,
        branchId,
        event: 'use',
        pack: getPackageInfo(),
        git: getGitInfo(),
        ...useParams
      });
    };
  }
}

const languagePackageBase = new LanguagePackage();

languagePackageBase.init({ paths: globalLanguagePackageConfig.get() });

export default languagePackageBase;
