import * as vscode from 'vscode';
import classNameBase from '../database/className';
import languagePackageBase from '../database/languagePackage';

const classNameMatchReg = /className=["|']/;
const classMatchReg = /class=["|']/;

const provideCompletionItems = (document: vscode.TextDocument, position: vscode.Position) => {
  const lineText = document.getText(new vscode.Range(new vscode.Position(position.line, 0), position));

  if (!classNameMatchReg.test(lineText) && !classMatchReg.test(lineText)) return [];

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
  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider('vue', { provideCompletionItems }, ' ', `'`, `"`)
  );
  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider('html', { provideCompletionItems }, ' ', `'`, `"`)
  );
  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider('wxml', { provideCompletionItems }, ' ', `'`, `"`)
  );
  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider('axml', { provideCompletionItems }, ' ', `'`, `"`)
  );
  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider('ttml', { provideCompletionItems }, ' ', `'`, `"`)
  );
}
