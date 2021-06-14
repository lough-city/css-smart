import * as vscode from 'vscode'
import cssCompletion from './function/cssVariables'
import tsxDefinition from './function/cssSkipInTSX'
import { globalAliasPathConfig, globalPathConfig } from './util/config'
import { CodelensProvider } from './function/cssCodeLens'

export function activate(context: vscode.ExtensionContext) {
    /* CSS 变量补全 */
    cssCompletion(context)

    /* TSX 跳转 CSS 文件 */
    tsxDefinition(context)

    vscode.languages.registerCodeLensProvider('css', new CodelensProvider())
    vscode.languages.registerCodeLensProvider('less', new CodelensProvider())
    vscode.languages.registerCodeLensProvider('scss', new CodelensProvider())

    context.subscriptions.push(
        // 设置全局变量文件
        vscode.commands.registerCommand('css-smart.setGlobalPath', globalPathConfig.setCurrentFilePath),
        // 设置别名路径文件
        vscode.commands.registerCommand('css-smart.setGlobalAliasPath', globalAliasPathConfig.setCurrentFilePath),
        vscode.commands.registerCommand('css-smart.codelensAction', (alias, value, fileName, range) => {
            const editor = vscode.window.activeTextEditor
            editor?.edit(editBuilder => {
                editBuilder.replace(range, `var(${alias})`)
            })
        })
    )
}

export function deactivate() {}
