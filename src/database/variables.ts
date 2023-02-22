import { join } from 'path';
import * as vscode from 'vscode';
import { IVariable } from '../typings';
import { globalVariablePathConfig } from '../util/config';
import findCssVariables from '../util/findCssVariables';
import { getWorkspaceRootPath } from '../util/path';

export class Variables {
  private options: { paths?: Array<string> } = {};

  init(parameters: { paths: Array<string> }) {
    this.options = parameters;

    return this;
  }

  getAll(): Array<IVariable> {
    if (!this.options.paths?.length) return [];

    const map = Object.assign(
      {},
      ...this.options.paths.map(path =>
        findCssVariables(join(getWorkspaceRootPath(), path), path.split('.')?.[1] || 'css')
      )
    );

    return Object.keys(map).map(code => ({ code, value: map[code] }));
  }

  getAllCompletionItems() {
    return this.getAll().map(variable => {
      const completionItem = new vscode.CompletionItem(
        variable.code,
        isNaN(parseFloat(variable.value)) ? vscode.CompletionItemKind.Color : vscode.CompletionItemKind.Value
      );

      completionItem.insertText = `var(${variable.code})`;
      completionItem.detail = `${variable.code}: ${variable.value};`;
      completionItem.filterText = `${variable.code}: ${variable.value};`;
      completionItem.documentation = variable.value;

      return completionItem;
    });
  }
}

const variablesBase = new Variables();

variablesBase.init({ paths: globalVariablePathConfig.get() });

export default variablesBase;
