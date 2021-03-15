import path = require('path')
import * as fs from 'fs'
import * as vscode from 'vscode'
import cssCompletion from './cssVariables'
import { globalAliasPathConfig, globalPathConfig } from './util/config'
import { getWorkspaceRootPath } from './util/path'
import { PATH_ALIAS_REG, PATH_BASE_URL_REG } from './constants/regex'
import { execObjectByString } from './util/regex'

export function activate(context: vscode.ExtensionContext) {
    cssCompletion(context)

    context.subscriptions.push(
        vscode.languages.registerDefinitionProvider('typescriptreact', {
            provideDefinition: (document, position) => {
                const configPath = globalAliasPathConfig.get()
                const content = fs.readFileSync(
                    configPath
                        ? getWorkspaceRootPath() + configPath
                        : path.resolve(getWorkspaceRootPath(), 'tsconfig.json'),
                    'utf-8'
                )
                const aliasDict = execObjectByString(PATH_ALIAS_REG, content)
                const baseUrl = PATH_BASE_URL_REG.exec(content)?.[1] || ''
                const fileName = document.fileName
                const word = document.getText(document.getWordRangeAtPosition(position, /('(.*?)')|("(.*?)") /))
                const line = document.lineAt(position)

                if (
                    line.text.includes('.css') ||
                    line.text.includes('.less') ||
                    line.text.includes('.scss') ||
                    line.text.includes('.styl')
                ) {
                    let importPath = word.replaceAll(`'`, '').replaceAll(`“`, '')

                    let locationPath = ''
                    const key = Object.keys(aliasDict).find(alias => importPath.includes(alias))
                    if (key) {
                        importPath = importPath.replace(key, aliasDict[key])

                        if (baseUrl) {
                            locationPath = path.resolve(getWorkspaceRootPath(), baseUrl, importPath)
                        } else {
                            locationPath = path.resolve(getWorkspaceRootPath(), importPath)
                        }
                    } else {
                        locationPath = path.resolve(path.dirname(fileName), importPath)
                    }

                    return new vscode.Location(vscode.Uri.file(locationPath), new vscode.Position(0, 0))
                }
            }
        })
    )

    // 设置全局变量地址
    context.subscriptions.push(
        vscode.commands.registerCommand('css-smart.setGlobalPath', () => {
            const path = vscode.window.activeTextEditor?.document.uri.fsPath
            const rootPath = getWorkspaceRootPath()

            if (!rootPath || !path) {
                vscode.window.showInformationMessage('当前无激活文件')
                return
            }

            const realPath = path.replace(rootPath, '')

            globalPathConfig
                .set(realPath)
                .then(() => vscode.window.showInformationMessage(`设置全局变量成功：${realPath}`))
        })
    )

    // 设置别名路径
    context.subscriptions.push(
        vscode.commands.registerCommand('css-smart.setGlobalAliasPath', () => {
            const path = vscode.window.activeTextEditor?.document.uri.fsPath
            const rootPath = getWorkspaceRootPath()

            if (!rootPath || !path) {
                vscode.window.showInformationMessage('当前无激活文件')
                return
            }

            const realPath = path.replace(rootPath, '')

            globalAliasPathConfig
                .set(realPath)
                .then(() => vscode.window.showInformationMessage(`设置别名路径成功：${realPath}`))
        })
    )
}

export function deactivate() {}
