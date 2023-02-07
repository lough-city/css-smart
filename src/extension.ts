import * as vscode from 'vscode';
import cssVariables from './function/cssVariables';
import cssSkipInTSX from './function/cssSkipInTSX';
import cssClassName from './function/cssClassName';
import {
  globalAliasPathConfig,
  globalClassNameConfig,
  globalPathConfig,
  globalThemePackageConfig
} from './util/config';
import { CodelensProvider } from './function/cssCodeLens';
import colorfullyBase from './database/colorfully';
import { getWorkspaceRootPath } from './util/path';
import { readdirSync } from 'fs';
import { join } from 'path';

export function activate(context: vscode.ExtensionContext) {
  /* 主题初始化 */
  const themePackage = globalThemePackageConfig.get();
  if (themePackage) colorfullyBase.initTheme(themePackage);

  /* CSS 类名补全 */
  cssClassName(context);

  /* CSS 变量补全 */
  cssVariables(context);

  /* TSX 跳转 CSS 文件 */
  cssSkipInTSX(context);

  /* 界面变量可使用提示 */
  vscode.languages.registerCodeLensProvider('css', new CodelensProvider());
  vscode.languages.registerCodeLensProvider('less', new CodelensProvider());
  vscode.languages.registerCodeLensProvider('scss', new CodelensProvider());

  context.subscriptions.push(
    // 设置全局变量文件
    vscode.commands.registerCommand('css-smart.setGlobalPath', globalPathConfig.setCurrentFilePath),
    // 设置别名路径文件
    vscode.commands.registerCommand('css-smart.setGlobalAliasPath', globalAliasPathConfig.setCurrentFilePath),
    vscode.commands.registerCommand('css-smart.setGlobalThemePackage', () => {
      const rootPath = getWorkspaceRootPath();
      const dirList = readdirSync(join(rootPath, 'node_modules'));

      [...dirList].forEach(dir => {
        if (!dir.includes('@')) return;
        const subDirList = readdirSync(join(rootPath, 'node_modules', dir));
        dirList.push(...subDirList.map(d => `${dir}/${d}`));
      });

      vscode.window
        .showQuickPick(['自定义', ...dirList.filter(dir => dir.includes('theme'))], {
          placeHolder: '选择你的 Colorfully 主题包名'
        })
        .then(async str => {
          let name = '';
          if (str === '自定义') {
            name = (await vscode.window.showInputBox({ placeHolder: '输入你的 Colorfully 主题包名' })) || '';
          } else name = str || '';

          if (name) {
            globalThemePackageConfig.set(name);
            colorfullyBase.initTheme(name);
            vscode.window.showInformationMessage(`设置成功：${name}`);
          } else vscode.window.showInformationMessage(`设置失败`);
        });
    }),
    vscode.commands.registerCommand('css-smart.setGlobalClassName', () => {
      const rootPath = getWorkspaceRootPath();
      const dirList = readdirSync(join(rootPath, 'node_modules'));

      [...dirList].forEach(dir => {
        if (!dir.includes('@')) return;
        const subDirList = readdirSync(join(rootPath, 'node_modules', dir));
        dirList.push(...subDirList.map(d => `${dir}/${d}`));
      });

      vscode.window
        .showQuickPick(['自定义', ...dirList.filter(dir => dir.includes('style'))], {
          placeHolder: '选择你的 ClassName 包名'
        })
        .then(async str => {
          let name = '';
          if (str === '自定义') {
            name = (await vscode.window.showInputBox({ placeHolder: '输入你的 ClassName 包名' })) || '';
          } else name = str || '';

          if (name) {
            globalClassNameConfig.set(Array.from(new Set([...globalClassNameConfig.get(), name])) as any);
            vscode.window.showInformationMessage(`设置成功：${name}`);
          } else vscode.window.showInformationMessage(`设置失败`);
        });
    }),
    vscode.commands.registerCommand('css-smart.codelensAction', (alias, value, fileName, range) => {
      const editor = vscode.window.activeTextEditor;
      editor?.edit(editBuilder => {
        editBuilder.replace(range, `var(${alias})`);
      });
    })
  );
}

export function deactivate() {}
