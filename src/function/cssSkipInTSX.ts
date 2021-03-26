import path = require('path')
import * as vscode from 'vscode'
import * as fs from 'fs'
import { globalAliasPathConfig } from '../util/config'
import { getWorkspaceRootPath } from '../util/path'
import { execObjectByString } from '../util/regex'
import { PATH_ALIAS_REG, PATH_BASE_URL_REG } from '../constants/regex'

const provideDefinition = (document: vscode.TextDocument, position: vscode.Position) => {
    const configPath = globalAliasPathConfig.get()
    const content = fs.readFileSync(
        configPath ? getWorkspaceRootPath() + configPath : path.resolve(getWorkspaceRootPath(), 'tsconfig.json'),
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

const tsxDefinition = (context: vscode.ExtensionContext) => {
    context.subscriptions.push(vscode.languages.registerDefinitionProvider('typescriptreact', { provideDefinition }))
}

export default tsxDefinition
