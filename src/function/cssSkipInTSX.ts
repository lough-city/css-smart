import * as vscode from 'vscode';
import languagePackageBase from '../database/languagePackage';
import tsAliasBase from '../database/tsAlias';

const provideDefinition = (document: vscode.TextDocument, position: vscode.Position) => {
  const fileName = document.fileName;
  const word = document.getText(document.getWordRangeAtPosition(position, /('(.*?)')|("(.*?)") /));
  const line = document.lineAt(position);
  const lineText = document.getText(new vscode.Range(new vscode.Position(position.line, 0), position));

  if (
    line.text.includes('.css') ||
    line.text.includes('.less') ||
    line.text.includes('.scss') ||
    line.text.includes('.styl')
  ) {
    const useFunc = languagePackageBase.statFunc({ name: 'FileSkip', targetValue: lineText });

    const locationPath = tsAliasBase.getLocationPath({ fileName, word });

    useFunc({ targetValue: lineText, value: locationPath });

    return new vscode.Location(vscode.Uri.file(locationPath), new vscode.Position(0, 0));
  }
};

const cssSkipInTSX = (context: vscode.ExtensionContext) => {
  context.subscriptions.push(vscode.languages.registerDefinitionProvider('javascriptreact', { provideDefinition }));
  context.subscriptions.push(vscode.languages.registerDefinitionProvider('typescriptreact', { provideDefinition }));
};

export default cssSkipInTSX;
