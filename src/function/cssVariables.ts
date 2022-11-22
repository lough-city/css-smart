import * as vscode from 'vscode';
import colorfully from '../database/colorfully';
import { globalPathConfig, globalThemePackageConfig } from '../util/config';
import findCssVariables from '../util/findCssVariables';
import { getWorkspaceRootPath } from '../util/path';

const provideCompletionItems = (document: vscode.TextDocument, position: vscode.Position) => {
  const line = document.lineAt(position);
  const path = getWorkspaceRootPath() + globalPathConfig.get();

  if (line.text.indexOf(':') === -1 && path.split('.')?.[1] !== 'styl') {
    return;
  }

  const themePackage = globalThemePackageConfig.get();
  const colorfullyItems = colorfully.getThemeCompletionItem(themePackage);

  const variables = Object.assign(
    {},
    !globalPathConfig.get() ? {} : findCssVariables(path, path.split('.')?.[1] || 'css')
  );
  const variableItems = Object.keys(variables).map(variable => {
    const variableValue = variables[variable];

    const completionItem = new vscode.CompletionItem(
      variable,
      isNaN(parseFloat(variableValue)) ? vscode.CompletionItemKind.Color : vscode.CompletionItemKind.Value
    );

    completionItem.insertText = `var(${variable})`;
    completionItem.detail = `${variable}: ${variableValue};`;
    completionItem.filterText = `${variable}: ${variableValue};`;
    completionItem.documentation = variableValue;

    return completionItem;
  });

  return [...colorfullyItems, ...[]];
};

export default function cssCompletion(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider('css', { provideCompletionItems }, '--', 'var', 'var(')
  );

  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider('less', { provideCompletionItems }, '--', 'var', 'var(')
  );

  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider('scss', { provideCompletionItems }, '--', 'var', 'var(')
  );

  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider('stylus', { provideCompletionItems }, '--', 'var', 'var(')
  );
}
