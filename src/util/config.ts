import * as vscode from 'vscode'
import { GLOBAL_ALIAS_PATH_KEY, GLOBAL_PATH_KEY } from '../constants/config'

class ConfigConstruction {
    constructor(public readonly key: string) {}

    set = (v: string) => vscode.workspace.getConfiguration().update(this.key, v)

    get = () => vscode.workspace.getConfiguration().get(this.key) as string
}

export const globalPathConfig = new ConfigConstruction(GLOBAL_PATH_KEY)
export const globalAliasPathConfig = new ConfigConstruction(GLOBAL_ALIAS_PATH_KEY)
