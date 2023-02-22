import * as vscode from 'vscode';
import classNameBase from '../database/className';
import languagePackageBase from '../database/languagePackage';

const classMatchReg = /className=["|']/;

const provideCompletionItems = (document: vscode.TextDocument, position: vscode.Position) => {
  const lineText = document.getText(new vscode.Range(new vscode.Position(position.line, 0), position));

  if (!classMatchReg.test(lineText)) return [];

  const useFunc = languagePackageBase.statFunc({ name: 'ClassNameCompletion', targetValue: lineText });
  const handle = (completionItemList: Array<vscode.CompletionItem>) =>
    completionItemList.map(item => {
      item.command = {
        command: 'css-smart.useClassNameCompletionEmit',
        title: '',
        arguments: [() => useFunc({ targetValue: lineText, value: item.insertText as string })]
      };

      return item;
    });

  return [
    ...handle(languagePackageBase.base.className.getAllCompletionItems()),
    ...handle(classNameBase.getAllCompletionItems())
  ];
};

export default function cssClassName(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider('javascriptreact', { provideCompletionItems }, ' ', `'`, `"`)
  );
  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider('typescriptreact', { provideCompletionItems }, ' ', `'`, `"`)
  );
}
