import * as vscode from 'vscode';
import colorfullyBase from '../database/colorfully';
import variableBase from '../database/variables';
import { IVariable } from '../typings';
import { globalPathConfig } from '../util/config';
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

function matchVariable(variables: Array<IVariable>, targetValue: string) {
  for (const variable of variables) {
    if (variable.value.toLocaleLowerCase() === targetValue.toLocaleLowerCase()) {
      return variable.code;
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
    this.codeLenses = [];
    const regex = new RegExp(this.regex);
    const text = document.getText();
    const path = getWorkspaceRootPath() + globalPathConfig.get();
    let matches, matchedAlias;

    if (path === '' || path === document.uri.fsPath) {
      return;
    }

    const variables = [...colorfullyBase.getAll(), ...variableBase.getAll()];
    while ((matches = regex.exec(text)) !== null) {
      if (matches[0].includes('--')) {
        continue;
      }

      matchedAlias = matchVariable(variables, matches[1]);

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
  }

  public resolveCodeLens(codeLens: vscode.CodeLens, token: vscode.CancellationToken) {
    return null;
  }
}
