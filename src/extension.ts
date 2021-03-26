import * as vscode from 'vscode'
import cssCompletion from './function/cssVariables'
import { globalAliasPathConfig, globalPathConfig } from './util/config'
import tsxDefinition from './function/cssSkipInTSX'

export function activate(context: vscode.ExtensionContext) {
    /* CSS 变量补全 */
    cssCompletion(context)

    /* TSX 跳转 CSS 文件 */
    tsxDefinition(context)

    context.subscriptions.push(
        // 设置全局变量文件
        vscode.commands.registerCommand('css-smart.setGlobalPath', globalPathConfig.setCurrentFilePath),
        // 设置别名路径文件
        vscode.commands.registerCommand('css-smart.setGlobalAliasPath', globalAliasPathConfig.setCurrentFilePath)
    )
}

export function deactivate() {}
