import * as vscode from 'vscode';
import colorfullyBase from '../database/colorfully';
import variableBase from '../database/variables';
import { globalPathConfig, globalThemePackageConfig } from '../util/config';
import { getWorkspaceRootPath } from '../util/path';

const provideCompletionItems = (document: vscode.TextDocument, position: vscode.Position) => {
  const line = document.lineAt(position);
  const path = getWorkspaceRootPath() + globalPathConfig.get();

  if (line.text.indexOf(':') === -1 && path.split('.')?.[1] !== 'styl') {
    return;
  }

  return [...colorfullyBase.getAllCompletionItems(), ...variableBase.getAllCompletionItems()];
};

export default function cssVariables(context: vscode.ExtensionContext) {
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
