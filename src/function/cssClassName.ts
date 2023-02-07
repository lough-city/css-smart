import * as vscode from 'vscode';
import classNameBase from '../database/className';

const classMatchReg = /className=["|']/;

const provideCompletionItems = (document: vscode.TextDocument, position: vscode.Position) => {
  const lineText: string = document.getText(new vscode.Range(new vscode.Position(position.line, 0), position));

  if (!classMatchReg.test(lineText)) return [];

  return [...classNameBase.getAllCompletionItems()];
};

export default function cssClassName(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider('javascriptreact', { provideCompletionItems }, ' ', `'`, `"`)
  );
  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider('typescriptreact', { provideCompletionItems }, ' ', `'`, `"`)
  );
}
