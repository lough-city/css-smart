import * as vscode from 'vscode';
import colorfullyBase from '../database/colorfully';
import languagePackageBase from '../database/languagePackage';
import variablesBase from '../database/variables';
import { IVariable } from '../typings';

const { CodeLens } = vscode;

class TipCodeLens extends CodeLens {
  constructor(fileName: string, range: any, alias: string, value: string, useFunc: any) {
    super(range, {
      arguments: [alias, value, fileName, range, useFunc],
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

  public async provideCodeLenses(document: vscode.TextDocument) {
    this.codeLenses = [];
    const regex = new RegExp(this.regex);
    const text = document.getText();
    let matches, matchedAlias;

    const variables = [
      ...languagePackageBase.base.colorfully.getAll(),
      ...languagePackageBase.base.variables.getAll(),
      ...colorfullyBase.getAll(),
      ...variablesBase.getAll()
    ];

    if (!variables.length) return this.codeLenses;

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
          const useFunc = languagePackageBase.statFunc({ name: 'VariableCodelens', targetValue: matches[0] });
          const params = { targetValue: matches[0], value: matchedAlias };
          this.codeLenses.push(
            new TipCodeLens(document.fileName, range, matchedAlias, matches[1], () => useFunc(params))
          );
        }
      }
    }

    return this.codeLenses;
  }

  public resolveCodeLens(codeLens: vscode.CodeLens, token: vscode.CancellationToken) {
    return null;
  }
}
