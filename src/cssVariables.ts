import * as vscode from 'vscode'
import { globalPathConfig } from './util/config'
import findCssVariables from './util/findCssVariables'

const provideCompletionItems = async (document: vscode.TextDocument, position: vscode.Position) => {
    const line = document.lineAt(position)
    const path = globalPathConfig.get()

    if (line.text.indexOf(':') === -1) {
        return
    }

    const variables = Object.assign({}, findCssVariables(path))

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
        vscode.languages.registerCompletionItemProvider('less', { provideCompletionItems }, '.', '-', 'var', 'var(')
    )
}
