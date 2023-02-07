import * as vscode from 'vscode';
import { GLOBAL_ALIAS_PATH_KEY, GLOBAL_CLASS_NAME, GLOBAL_PATH_KEY, GLOBAL_THEME_PACKAGE } from '../constants/config';
import { getWorkspaceRootPath } from './path';

class ConfigConstruction<T = string> {
  public key: string;
  public type: 'string' | 'array';
  constructor(key: string, type: 'string' | 'array' = 'string') {
    this.key = key;
    this.type = type;
  }

  get() {
    return vscode.workspace.getConfiguration().get(this.key, this.type === 'string' ? '' : []) as any as T;
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
export const globalPathConfig = new ConfigConstruction(GLOBAL_PATH_KEY);

/**
 * 全局别名路径
 */
export const globalAliasPathConfig = new ConfigConstruction(GLOBAL_ALIAS_PATH_KEY);

/**
 * 全局主题包路径
 */
export const globalThemePackageConfig = new ConfigConstruction(GLOBAL_THEME_PACKAGE);

/**
 * 全局主类名路径
 */
export const globalClassNameConfig = new ConfigConstruction<Array<string>>(GLOBAL_CLASS_NAME, 'array');
