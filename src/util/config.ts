import * as vscode from 'vscode'
import { GLOBAL_ALIAS_PATH_KEY, GLOBAL_PATH_KEY } from '../constants/config'
import { getWorkspaceRootPath } from './path'

class ConfigConstruction {
    constructor(public readonly key: string) {}

    get = () => vscode.workspace.getConfiguration().get(this.key) as string

    set = (v: string) => vscode.workspace.getConfiguration().update(this.key, v)

    setCurrentFilePath = () => {
        const path = vscode.window.activeTextEditor?.document.uri.fsPath
        const rootPath = getWorkspaceRootPath()

        if (!rootPath || !path) {
            vscode.window.showInformationMessage('当前无激活文件')
            return
        }

        const realPath = path.replace(rootPath, '')

        this.set(realPath).then(() => vscode.window.showInformationMessage(`设置成功：${realPath}`))
    }
}

/**
 * 全局变量路径
 */
export const globalPathConfig = new ConfigConstruction(GLOBAL_PATH_KEY)

/**
 * 全局别名路径
 */
export const globalAliasPathConfig = new ConfigConstruction(GLOBAL_ALIAS_PATH_KEY)
