import * as vscode from 'vscode'
import { globalPathConfig } from '../util/config'
import findCssVariables from '../util/findCssVariables'
import { getWorkspaceRootPath } from '../util/path'

const provideCompletionItems = (document: vscode.TextDocument, position: vscode.Position) => {
    const line = document.lineAt(position)
    const path = getWorkspaceRootPath() + globalPathConfig.get()

    if (line.text.indexOf(':') === -1 && path.split('.')?.[1] !== 'styl') {
        return
    }

    const variables = Object.assign({}, findCssVariables(path, path.split('.')?.[1] || 'css'))

    return Object.keys(variables).map(variable => {
        const variableValue = variables[variable]

        const completionItem = new vscode.CompletionItem(variable, vscode.CompletionItemKind.Variable)

        completionItem.insertText = `var(${variable})`
        completionItem.detail = variableValue
        completionItem.filterText = `${variable}: ${variableValue};`
        completionItem.documentation = `${variable}: ${variableValue};`

        return completionItem
    })
}

export default function cssCompletion(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.languages.registerCompletionItemProvider('css', { provideCompletionItems }, '.', '-', 'var', 'var(')
    )

    context.subscriptions.push(
        vscode.languages.registerCompletionItemProvider('less', { provideCompletionItems }, '.', '-', 'var', 'var(')
    )

    context.subscriptions.push(
        vscode.languages.registerCompletionItemProvider('scss', { provideCompletionItems }, '.', '-', 'var', 'var(')
    )

    context.subscriptions.push(
        vscode.languages.registerCompletionItemProvider('stylus', { provideCompletionItems }, '.', '-', 'var', 'var(')
    )
}
