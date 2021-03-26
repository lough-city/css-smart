import * as vscode from 'vscode'
import { GLOBAL_ALIAS_PATH_KEY, GLOBAL_PATH_KEY } from '../constants/config'
import { getWorkspaceRootPath } from './path'

class ConfigConstruction {
    constructor(public readonly key: string) {}

    set = (v: string) => vscode.workspace.getConfiguration().update(this.key, v)

    get = () => vscode.workspace.getConfiguration().get(this.key) as string

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

export const globalPathConfig = new ConfigConstruction(GLOBAL_PATH_KEY)
export const globalAliasPathConfig = new ConfigConstruction(GLOBAL_ALIAS_PATH_KEY)
