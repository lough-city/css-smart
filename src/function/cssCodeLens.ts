import * as vscode from 'vscode';
import { globalPathConfig } from '../util/config';
import findCssVariables from '../util/findCssVariables';
import { getWorkspaceRootPath } from '../util/path';

const { CodeLens } = vscode;

class TipCodeLens extends CodeLens {
  constructor(fileName: string, range: any, alias: string, value: string) {
    super(range, {
      arguments: [alias, value, fileName, range],
      command: 'css-smart.codelensAction',
      title: `${value} can use ${alias}`
    });
  }
}

function matchLessVariable(lessVariables: any, targetValue: string) {
  for (const key in lessVariables) {
    if (lessVariables[key].toLocaleLowerCase() === targetValue.toLocaleLowerCase()) {
      return key;
    }
  }
}

export class CodelensProvider implements vscode.CodeLensProvider {
  private codeLenses: vscode.CodeLens[] = [];
  private regex: RegExp;
  private _onDidChangeCodeLenses: vscode.EventEmitter<void> = new vscode.EventEmitter<void>();
  public readonly onDidChangeCodeLenses: vscode.Event<void>;

  constructor() {
    this.regex = /.:[\s]*([^:\s;]+)/g;

    vscode.workspace.onDidChangeConfiguration(_ => {
      this._onDidChangeCodeLenses.fire();
    });

    this.onDidChangeCodeLenses = this._onDidChangeCodeLenses.event;
  }

  public async provideCodeLenses(document: vscode.TextDocument, token: vscode.CancellationToken) {
    // if (vscode.workspace.getConfiguration('codelens-sample').get('enableCodeLens', true)) {
    this.codeLenses = [];
    const regex = new RegExp(this.regex);
    const text = document.getText();
    const path = getWorkspaceRootPath() + globalPathConfig.get();
    let matches, matchedAlias;

    if (path === '' || path === document.uri.fsPath) {
      return;
    }

    const lessVariables = Object.assign({}, findCssVariables(path, path.split('.')?.[1] || 'css'));
    while ((matches = regex.exec(text)) !== null) {
      if (matches[0].includes('--')) {
        continue;
      }

      matchedAlias = matchLessVariable(lessVariables, matches[1]);
      if (matchedAlias) {
        const line = document.lineAt(document.positionAt(matches.index).line);
        const indexOf = line.text.indexOf(matches[1]);
        const position = new vscode.Position(line.lineNumber, indexOf);
        const range = document.getWordRangeAtPosition(position, new RegExp(/([^:\s;]+)/g));
        if (range) {
          this.codeLenses.push(new TipCodeLens(document.fileName, range, matchedAlias, matches[1]));
        }
      }
    }
    return this.codeLenses;
    // }
    // return []
  }

  public resolveCodeLens(codeLens: vscode.CodeLens, token: vscode.CancellationToken) {
    return null;
  }
}
