import * as vscode from 'vscode';
import colorfullyBase from '../database/colorfully';
import languagePackageBase from '../database/languagePackage';
import variablesBase from '../database/variables';
import { globalVariablePathConfig } from '../util/config';
import { getWorkspaceRootPath } from '../util/path';

const provideCompletionItems = (document: vscode.TextDocument, position: vscode.Position) => {
  const line = document.lineAt(position);
  const lineText = document.getText(new vscode.Range(new vscode.Position(position.line, 0), position));
  const path = getWorkspaceRootPath() + globalVariablePathConfig.get();

  if (line.text.indexOf(':') === -1 && path.split('.')?.[1] !== 'styl') {
    return;
  }

  const useFunc = languagePackageBase.statFunc({ name: 'VariableCompletion', targetValue: lineText });
  const handle = (completionItemList: Array<vscode.CompletionItem>) =>
    completionItemList.map(item => {
      item.command = {
        command: 'css-smart.useVariableCompletionEmit',
        title: '',
        arguments: [() => useFunc({ targetValue: lineText, value: item.insertText as string })]
      };

      return item;
    });

  return [
    ...handle(languagePackageBase.base.colorfully.getAllCompletionItems()),
    ...handle(languagePackageBase.base.variables.getAllCompletionItems()),
    ...handle(colorfullyBase.getAllCompletionItems()),
    ...handle(variablesBase.getAllCompletionItems())
  ];
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
    vscode.languages.registerCompletionItemProvider('sass', { provideCompletionItems }, '--', 'var', 'var(')
  );

  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider('stylus', { provideCompletionItems }, '--', 'var', 'var(')
  );

  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider('vue', { provideCompletionItems }, '--', 'var', 'var(')
  );

  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider('wxss', { provideCompletionItems }, '--', 'var', 'var(')
  );

  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider('acss', { provideCompletionItems }, '--', 'var', 'var(')
  );

  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider('ttss', { provideCompletionItems }, '--', 'var', 'var(')
  );
}
