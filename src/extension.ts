import * as vscode from 'vscode';
import cssCompletion from './function/cssVariables';
import tsxDefinition from './function/cssSkipInTSX';
import { globalAliasPathConfig, globalPathConfig, globalThemePackageConfig } from './util/config';
import { CodelensProvider } from './function/cssCodeLens';
import colorfully from './database/colorfully';

export function activate(context: vscode.ExtensionContext) {
  /* 主题初始化 */
  const themePackage = globalThemePackageConfig.get();
  if (themePackage) colorfully.initTheme(themePackage);

  /* CSS 变量补全 */
  cssCompletion(context);

  /* TSX 跳转 CSS 文件 */
  tsxDefinition(context);

  /* 界面变量可使用提示 */
  vscode.languages.registerCodeLensProvider('css', new CodelensProvider());
  vscode.languages.registerCodeLensProvider('less', new CodelensProvider());
  vscode.languages.registerCodeLensProvider('scss', new CodelensProvider());

  context.subscriptions.push(
    // 设置全局变量文件
    vscode.commands.registerCommand('css-smart.setGlobalPath', globalPathConfig.setCurrentFilePath),
    // 设置别名路径文件
    vscode.commands.registerCommand('css-smart.setGlobalAliasPath', globalAliasPathConfig.setCurrentFilePath),
    vscode.commands.registerCommand('css-smart.codelensAction', (alias, value, fileName, range) => {
      const editor = vscode.window.activeTextEditor;
      editor?.edit(editBuilder => {
        editBuilder.replace(range, `var(${alias})`);
      });
    })
  );
}

export function deactivate() {}
