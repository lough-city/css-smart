import * as vscode from 'vscode';
import {
  GLOBAL_ALIAS_PATH_KEY,
  GLOBAL_CLASS_NAME,
  GLOBAL_LANGUAGE_PACKAGE,
  GLOBAL_VARIABLE_PATH_KEY,
  GLOBAL_THEME_PACKAGE
} from '../constants/config';
import { getWorkspaceRootPath } from './path';

class ConfigConstruction<T = string> {
  public key: string;
  public type: 'string' | 'array';
  private callback?: (p: T) => T;
  constructor(key: string, type: 'string' | 'array' = 'string', callback?: (p: T) => T) {
    this.key = key;
    this.type = type;
    this.callback = callback;
  }

  get() {
    const v = vscode.workspace.getConfiguration().get(this.key, this.type === 'string' ? '' : []) as any as T;

    return this.callback ? this.callback(v) : v;
  }

  set(v: T) {
    return vscode.workspace.getConfiguration().update(this.key, v);
  }

  setCurrentFilePath() {
    const path = vscode.window.activeTextEditor?.document.uri.fsPath;
    const rootPath = getWorkspaceRootPath();

    if (!rootPath || !path) {
      vscode.window.showInformationMessage('当前无激活文件');
      return;
    }

    const realPath = path.replace(rootPath, '');
    this.set(
      (this.type === 'string'
        ? realPath
        : Array.from(new Set([...(this.get() as any as Array<string>), realPath]))) as any
    ).then(() => vscode.window.showInformationMessage(`设置成功：${realPath}`));
  }
}

/**
 * 全局变量路径
 */
export const globalVariablePathConfig = new ConfigConstruction<Array<string>>(GLOBAL_VARIABLE_PATH_KEY, 'array', v => {
  const oldV = vscode.workspace.getConfiguration().get('css-smart.globalPath') as string;
  return oldV ? [oldV, ...v] : v;
});

/**
 * 全局别名路径
 * @deprecated
 */
export const globalAliasPathConfig = new ConfigConstruction(GLOBAL_ALIAS_PATH_KEY);

/**
 * 全局主题包路径
 */
export const globalThemePackageConfig = new ConfigConstruction<Array<string>>(GLOBAL_THEME_PACKAGE, 'array', v =>
  Array.isArray(v) ? v : [v]
);

/**
 * 全局类名路径
 */
export const globalClassNameConfig = new ConfigConstruction<Array<string>>(GLOBAL_CLASS_NAME, 'array', v =>
  Array.isArray(v) ? v : [v]
);

/**
 * 全局语言包路径
 */
export const globalLanguagePackageConfig = new ConfigConstruction<Array<string>>(GLOBAL_LANGUAGE_PACKAGE, 'array');
