import * as vscode from 'vscode';
import cssVariables from './function/cssVariables';
// import cssSkipInTSX from './function/cssSkipInTSX';
import cssClassName from './function/cssClassName';
import {
  // globalAliasPathConfig,
  globalClassNameConfig,
  globalVariablePathConfig,
  globalThemePackageConfig,
  globalLanguagePackageConfig
} from './util/config';
import { CodelensProvider } from './function/cssCodeLens';
import colorfullyBase from './database/colorfully';
import { getWorkspaceRootPath } from './util/path';
import { readdirSync } from 'fs';
import { join } from 'path';
import { initInfo } from './util/info';
import languagePackageBase from './database/languagePackage';

export async function activate(context: vscode.ExtensionContext) {
  /* 初始化 git 以及 package 信息 */
  await initInfo();

  /* 初始化 语言包 */
  await languagePackageBase.loadData();

  /* 初始化 主题包数据*/
  await languagePackageBase.base.colorfully.loadData();
  await colorfullyBase.loadData();

  /* CSS 类名补全 */
  cssClassName(context);

  /* CSS 变量补全 */
  cssVariables(context);

  /* TSX 跳转 CSS 文件 */
  // cssSkipInTSX(context);

  /* 界面变量可使用提示 */
  vscode.languages.registerCodeLensProvider('css', new CodelensProvider());
  vscode.languages.registerCodeLensProvider('less', new CodelensProvider());
  vscode.languages.registerCodeLensProvider('scss', new CodelensProvider());

  context.subscriptions.push(
    // 设置全局变量文件
    vscode.commands.registerCommand('css-smart.setGlobalVariablePath', () =>
      globalVariablePathConfig.setCurrentFilePath()
    ),
    // 设置别名路径文件
    // vscode.commands.registerCommand('css-smart.setGlobalAliasPath', () => globalAliasPathConfig.setCurrentFilePath()),
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
            globalThemePackageConfig.set(Array.from(new Set([...globalThemePackageConfig.get(), name])) as any);
            colorfullyBase.init({ paths: globalThemePackageConfig.get() }).loadData();
            vscode.window.showInformationMessage(`设置成功：${name}`);
          } else vscode.window.showInformationMessage(`设置失败`);
        });
    }),
    vscode.commands.registerCommand('css-smart.setGlobalClassName', () => globalClassNameConfig.setCurrentFilePath()),
    vscode.commands.registerCommand('css-smart.setGlobalLanguagePackage', () => {
      const rootPath = getWorkspaceRootPath();
      const dirList = readdirSync(join(rootPath, 'node_modules'));

      [...dirList].forEach(dir => {
        if (!dir.includes('@')) return;
        const subDirList = readdirSync(join(rootPath, 'node_modules', dir));
        dirList.push(...subDirList.map(d => `${dir}/${d}`));
      });

      vscode.window
        .showQuickPick(
          ['自定义', ...dirList.filter(dir => dir.includes('theme') || dir.includes('style') || dir.includes('lang'))],
          {
            placeHolder: '选择你的 Language 语言包名'
          }
        )
        .then(async str => {
          let name = '';
          if (str === '自定义') {
            name = (await vscode.window.showInputBox({ placeHolder: '输入你的 Language 语言包名' })) || '';
          } else name = str || '';

          if (name) {
            globalLanguagePackageConfig.set(Array.from(new Set([...globalLanguagePackageConfig.get(), name])) as any);
            languagePackageBase
              .init({ paths: globalLanguagePackageConfig.get() })
              .loadData()
              ?.then(() => {
                languagePackageBase.base.colorfully.loadData();
              });
            vscode.window.showInformationMessage(`设置成功：${name}`);
          } else vscode.window.showInformationMessage(`设置失败`);
        });
    }),
    vscode.commands.registerCommand('css-smart.codelensAction', (alias, value, fileName, range, useFunc) => {
      const editor = vscode.window.activeTextEditor;
      editor?.edit(editBuilder => {
        editBuilder.replace(range, `var(${alias})`);
      });
      useFunc();
    }),
    vscode.commands.registerCommand('css-smart.useVariableCompletionEmit', func => func()),
    vscode.commands.registerCommand('css-smart.useClassNameCompletionEmit', func => func())
  );

  languagePackageBase.statMount();
}

export function deactivate() {}
